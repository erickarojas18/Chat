import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
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
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
