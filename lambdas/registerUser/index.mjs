import mongoose from 'mongoose';
import User from './models/User.mjs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const handler = async (event) => {
  try {
    // Conectarse a la base de datos MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Parsear el cuerpo del evento
    const { email, password, name, companyId } = JSON.parse(event.body);

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { 
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3001', // Permitir solicitudes desde el frontend
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'User already exists' }) 
      };
    }

    // Cifrar la contraseña del nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      companyId
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    return { 
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3001', // Permitir solicitudes desde el frontend
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'User registered successfully' }) 
    };
  } catch (error) {
    return { 
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3001', // Permitir solicitudes desde el frontend
      },
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
