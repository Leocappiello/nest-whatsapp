import mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  display_phone_number: { type: Number },
  phone_number_id: { type: Number },
  from: { type: Number, required: true, unique: true },
  data: [
    {
      id: { type: String, unique: true },
      type: { type: String },
      message: { type: Object },
      status: [],
      display_phone_number: { type: Number },
      phone_number_id: { type: Number },
    },
  ],
});

export const MessageModel = mongoose.model('Message', MessageSchema);
