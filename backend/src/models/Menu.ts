import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: 'Coffee' | 'Tea' | 'Snacks' | 'Desserts' | 'Drinks' | 'Burger' | 'Cone Pizza';
  image?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Coffee', 'Tea', 'Snacks', 'Desserts', 'Drinks', 'Burger', 'Cone Pizza']
  },
  image: { type: String },
  isAvailable: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IMenuItem>('MenuItem', MenuSchema); 