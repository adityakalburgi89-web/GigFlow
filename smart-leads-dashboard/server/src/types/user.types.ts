import { Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'sales_user';
  createdAt: Date;
}

export interface IUserDocument extends IUser, Document { }
