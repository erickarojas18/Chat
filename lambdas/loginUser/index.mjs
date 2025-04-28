import mongoose from 'mongoose';
import User from './models/User.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const handler = async (event) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { email, password } = JSON.parse(event.body);

    const user = await User.findOne({ email });
    if (!user) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid credentials' }) };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid credentials' }) };
    }

    const token = jwt.sign(
      { userId: user._id, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        message: 'Login exitoso',
        token 
      }) 
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
