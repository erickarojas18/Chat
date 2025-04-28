import mongoose from 'mongoose'; // 👈 importar mongoose directo
import Message from './models/messageModel.mjs'; // tu modelo de mensajes

export const handler = async (event) => {
  // Conexión directa aquí
  await mongoose.connect(process.env.MONGO_URI);

  const { from, to, content } = JSON.parse(event.body);

  if (!from || !to || !content) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Faltan datos' }) };
  }

  const message = new Message({ from, to, content });

  try {
    await message.save();
    return { statusCode: 200, body: JSON.stringify({ message: 'Mensaje enviado' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
