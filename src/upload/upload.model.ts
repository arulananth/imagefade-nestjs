import * as mongoose from 'mongoose';
const { Schema } = mongoose;
export const UploadSchema = new mongoose.Schema({
  file: { type: Object},
  user_id:
  {
     type: Schema.Types.ObjectId, ref: 'User'
  },
  subscription_id:
  {
     type: Schema.Types.ObjectId, ref: 'Subscription'
  },
  machine_id: { type: String },
  deepNudeFile: { type: Object },
},{ timestamps: true});

export interface Upload extends mongoose.Document {
  _id: string;
  file: object;
  user_id: string;
  subscription_id: string;
  machine_id: number;
  deepNudeFile:object;
}

