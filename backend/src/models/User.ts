import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

export const User = models.User || model('User', userSchema, 'users');