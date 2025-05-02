import mongoose from 'mongoose';
import Message from './models/historyModel.mjs';

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
  try {
    await connectDB();

    const { userId, limit = 100, before } = event.queryStringParameters || {};

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          success: false,
          message: 'Se requiere userId',
        }),
      };
    }

    // 🔍 Buscar solo mensajes enviados por el usuario
    let query = { from: userId };

    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 }) // los más recientes primero
      .limit(parseInt(limit))
      .select('from to content timestamp read')
      .lean();

    const nextCursor = messages.length > 0 ? messages[messages.length - 1].timestamp : null;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: {
          messages,
          meta: {
            count: messages.length,
            hasMore: messages.length === parseInt(limit),
            nextCursor,
          },
        },
      }),
    };
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: false,
        message: 'Error interno al obtener el historial',
        error: error.message,
      }),
    };
  }
};
