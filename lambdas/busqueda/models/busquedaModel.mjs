import mongoose from 'mongoose';

const busquedaSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    }
    // NO pongas createdAt manualmente
  },
  {
    timestamps: true, // Esto agrega automáticamente createdAt y updatedAt
  }
);

const Busqueda = mongoose.model('Busqueda', busquedaSchema);

export default Busqueda;
