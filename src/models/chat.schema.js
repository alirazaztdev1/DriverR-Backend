import mongoose from 'mongoose';
import { messageStatusEnum } from '../enums/statusType.enum.js';

const chatSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    status: {
      type: String,
      enum: Object.values(messageStatusEnum),
      default: messageStatusEnum.ACTIVE,
    },
    blockedBy: {
      type: String,
      // ref: 'Company',
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          // type: String,
          required: true,
        },
        attachment: { type: String, required: false },
        message: { type: String, required: false },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
