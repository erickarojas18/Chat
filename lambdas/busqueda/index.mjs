import mongoose from 'mongoose';
import Message from './models/messageModel.mjs';

// Conexión reutilizable
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
};

export const handler = async (event) => {
  await connectDB();

  const { from, to } = event.queryStringParameters || {};

  if (!from || !to) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3001',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Se requieren los campos "from" y "to"' }),
    };
  }

  try {
    const messages = await Message.find({
      $or: [
        { from: { $regex: new RegExp(from, 'i') }, to: { $regex: new RegExp(to, 'i') } },
        { from: { $regex: new RegExp(to, 'i') }, to: { $regex: new RegExp(from, 'i') } },
      ]
    }).sort({ timestamp: 1 });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3001',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        count: messages.length,
        messages,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3001',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Error interno', error: error.message }),
    };
  }
};
