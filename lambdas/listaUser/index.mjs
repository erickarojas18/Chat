import mongoose from 'mongoose';
import User from './models/User.mjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

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
        return reject(new Error('Invalid or expired token'));
      }
      resolve(decoded);
    });
  });
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Permite estos headers en la solicitud
};

export const handler = async (event) => {
  console.log('Lambda started');

  // Manejo de preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  try {
    await connectToDatabase();

    const authHeader = event.headers.Authorization || event.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: 'Authorization token is required' }),
      };
    }

    const decoded = await verifyToken(token);
    console.log('User authenticated:', decoded);

    if (event.httpMethod === 'GET') {
      const companyId = event.queryStringParameters?.companyId;

      if (!companyId) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ message: 'Company ID is required' }),
        };
      }

      if (decoded.companyId !== companyId) {
        return {
          statusCode: 403,
          headers: CORS_HEADERS,
          body: JSON.stringify({ message: 'User is not authorized to access this company\'s data' }),
        };
      }

      const users = await User.find({ companyId });

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(users),
      };
    }

    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Route not found' }),
    };

  } catch (error) {
    console.error('Error occurred:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
