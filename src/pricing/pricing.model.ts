import * as mongoose from 'mongoose';

export const PriceSchema = new mongoose.Schema({
  title: { type: String},
  description: { type: String },
  price: { type: Number, },
  fileCount: { type: Number },
},{ timestamps: true});

export interface Price extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  fileCount: number;
  validDays:number;
}
