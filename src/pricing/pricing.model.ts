import * as mongoose from 'mongoose';
const { Schema } = mongoose;
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

export const SubscriptionSchema = new mongoose.Schema({
  price_id:
  {
     type: Schema.Types.ObjectId, ref: 'Price'
  },
  title: { type: String},
  description: { type: String },
  price: { type: Number },
  fileCount: { type: Number },
  expireDate:{type:Date},
  cryptoData:{ type:Object}
},{ timestamps: true});

export interface Subscription extends mongoose.Document {
  _id: string;
  price_id: string;
  title: string;
  description: string;
  price: number;
  fileCount: number;
  validDays:number;
  expireDate:Date;
}