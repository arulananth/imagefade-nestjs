import * as mongoose from 'mongoose';
const { Schema } = mongoose;
export const PriceSchema = new mongoose.Schema({
  title: { type: String},
  description: { type: String },
  price: { type: Number, },
  fileCount: { type: Number },
  validDays:{type:Number,default:30}
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
  plan_id:
  {
     type: Schema.Types.ObjectId, ref: 'Price'
  },
  user_id:
  {
     type: Schema.Types.ObjectId, ref: 'User'
  },
  title: { type: String},
  description: { type: String },
  price: { type: Number },
  fileCount: { type: Number },
  expireDate:{type:Date},
  cryptoData:{ type:Object},
  lastVerify:{type:Date},
  transactionId: { type: String},
  network: { type: String},
  blockchain: { type: String},
  addresss: { type: String},
  coinPrice: { type: Number},
  status: { type: String},
},{ timestamps: true});

export interface Subscription extends mongoose.Document {
  _id: string;
  plan_id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  fileCount: number;
  cryptoData:object;
  validDays:number;
  expireDate:Date;
  lastVerify:Date;
  transactionId:  String;
  network:  String;
  blockchain:  String;
  addresss:  String;
  coinPrice: Number;
  status: String;
}