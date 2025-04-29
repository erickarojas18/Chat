import mongoose from 'mongoose';
import Message from './models/messageModel.mjs';

export const handler = async (event) => {
  await mongoose.connect(process.env.MONGO_URI);

  const { from, to, content } = JSON.parse(event.body);

  if (!from || !to || !content) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3001',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Faltan datos' }),
    };
  }

  const message = new Message({ from, to, content });

  try {
    await message.save();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3001',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Mensaje enviado' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3001',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: error.message }),
    };
  }
};
