import { Schema, model } from 'mongoose';
import type { IUserDocument } from '../types';

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'sales_user'],
      default: 'sales_user',
    },
  },
  { timestamps: true },
);

export const User = model<IUserDocument>('User', userSchema);
