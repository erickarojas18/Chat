import mongoose from 'mongoose';
import User from './models/User.mjs'; // Asegúrate de importar correctamente el modelo
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; // Asegúrate de tener jsonwebtoken instalado

dotenv.config();

// Variable para la conexión a MongoDB, para que sea persistente
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('MongoDB connected!');
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject('Invalid or expired token');
      }
      resolve(decoded);
    });
  });
};

export const handler = async (event) => {
  console.log('Lambda started');

  try {
    // Asegúrate de conectar a la base de datos
    await connectToDatabase();

    // Verificar el token JWT
    const token = event.headers.Authorization && event.headers.Authorization.split(' ')[1];

    if (!token) {
      return { statusCode: 401, body: JSON.stringify({ message: 'Authorization token is required' }) };
    }

    // Verificar el token JWT
    const decoded = await verifyToken(token);
    console.log('User authenticated:', decoded);

    // Ruta GET /users para obtener los usuarios de una empresa
    if (event.httpMethod === 'GET') {
      const companyId = event.queryStringParameters.companyId;  // Obtén companyId desde los parámetros de la consulta

      if (!companyId) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Company ID is required' }) };
      }

      // Verificar que el usuario autenticado pertenezca a la misma empresa
      if (decoded.companyId !== companyId) {
        return { statusCode: 403, body: JSON.stringify({ message: 'User is not authorized to access this company\'s data' }) };
      }

      const users = await User.find({ companyId });  // Filtramos por companyId

      return {
        statusCode: 200,
        body: JSON.stringify(users),
      };
    }

    return { statusCode: 404, body: JSON.stringify({ message: 'Route not found' }) };
  } catch (error) {
    console.error('Error occurred:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
