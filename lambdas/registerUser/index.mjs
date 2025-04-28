// registerUser/index.mjs
import mongoose from 'mongoose';
import User from '../loginUser/models/User.mjs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const handler = async (event) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { email, password, name, companyId } = JSON.parse(event.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { statusCode: 400, body: JSON.stringify({ message: 'User already exists' }) };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      companyId
    });

    await newUser.save();

    return { statusCode: 201, body: JSON.stringify({ message: 'User registered successfully' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};