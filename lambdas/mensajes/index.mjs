import mongoose from 'mongoose';
import Message from './models/messageModel.mjs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler = async (event) => {
  // Conexión a MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Error de conexión a la base de datos' }),
    };
  }

  // Manejo de preflight (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // POST - enviar mensaje
  if (event.httpMethod === 'POST') {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Cuerpo vacío' }),
      };
    }

    const { from, to, content } = JSON.parse(event.body);

    if (!from || !to || !content) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Faltan datos' }),
      };
    }

    const message = new Message({ from, to, content });

    try {
      await message.save();
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Mensaje enviado' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }

  // GET - obtener mensajes entre dos usuarios
  if (event.httpMethod === 'GET') {
    const { from, to } = event.queryStringParameters || {};

    if (!from || !to) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Faltan parámetros' }),
      };
    }

    try {
      const messages = await Message.find({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }).sort({ timestamp: 1 }); // Usamos `timestamp` para ordenar

      // Formatear el `timestamp` antes de enviar al frontend
      const formattedMessages = messages.map((msg) => {
        return {
          ...msg.toObject(),
          timestamp: msg.timestamp.toISOString(), // Convertir `timestamp` a ISO
        };
      });

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ messages: formattedMessages }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }

  // Método no permitido
  return {
    statusCode: 405,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message: 'Método no permitido' }),
  };
};
