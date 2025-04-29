import mongoose from 'mongoose';
import Busqueda from './models/busquedaModel.mjs'; // << Cambiado aquí

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
      body: JSON.stringify({ message: 'Se requieren los campos "from" y "to"' }),
    };
  }

  const filters = {
    from: { $regex: new RegExp(`^${from}$`, 'i') },
    to: { $regex: new RegExp(`^${to}$`, 'i') }
  };

  try {
    console.log('Filtro que voy a buscar:', JSON.stringify(filters));
    const messages = await Busqueda.find(filters).sort({ createdAt: 1 }); // << Cambiado aquí también

    if (messages.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No se encontraron mensajes." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
