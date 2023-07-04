import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  title: { type: String},
  description: { type: String },
  price: { type: Number, },
  filePath: { type: String },
},{ timestamps: true});

export interface Product extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  filePath: string;
}
