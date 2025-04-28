import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: { 
    type: String, 
    required: true,
    index: true
  },
  to: { 
    type: String, 
    required: true,
    index: true
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  read: {
    type: Boolean,
    default: false
  }
});

// Índice compuesto para búsquedas de conversaciones
messageSchema.index({ 
  from: 1, 
  to: 1, 
  timestamp: -1 
});

export default mongoose.model('Message', messageSchema);