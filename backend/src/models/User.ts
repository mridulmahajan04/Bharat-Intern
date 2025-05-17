import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  phoneNumber: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 