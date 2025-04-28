import mongoose from 'mongoose';
import Message from './models/historyModel.mjs'

// Configuración de conexión reusable
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
    // 1. Conectar a MongoDB
    await connectDB();
    
    // 2. Parsear parámetros de la solicitud
    const { userId, contactId, limit = 100, before } = event.queryStringParameters || {};
    
    // 3. Validar parámetros requeridos
    if (!userId || !contactId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Se requieren userId y contactId'
        })
      };
    }

    // 4. Construir query para obtener la conversación bilateral
    const query = {
      $or: [
        { from: userId, to: contactId }, // Mensajes enviados por el usuario
        { from: contactId, to: userId }   // Mensajes recibidos del contacto
      ]
    };

    // 5. Opción de paginación (cargar mensajes más antiguos)
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    // 6. Ejecutar consulta con ordenamiento y límite
    const messages = await Message.find(query)
      .sort({ timestamp: 1 })      // Orden ascendente (más antiguos primero)
      .limit(parseInt(limit))      // Limitar resultados
      .select('from to content timestamp read') // Seleccionar campos
      .lean();                     // Optimizar performance

    // 7. Formatear respuesta
    const nextCursor = messages.length > 0 ? messages[messages.length - 1].timestamp : null;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          messages,                // Mensajes ya ordenados cronológicamente
          meta: {
            count: messages.length,
            hasMore: messages.length === parseInt(limit),
            nextCursor
          }
        }
      })
    };
    
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Error interno al obtener el historial',
        error: error.message
      })
    };
  }
};
