import { Injectable, NotFoundException, OnModuleInit,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload } from './upload.model';
import { Subscription } from 'src/pricing/pricing.model';
import {machineId, machineIdSync} from 'node-machine-id';
@Injectable()
export class UploadService {

    constructor(
        @InjectModel('Upload') private readonly UploadModel: Model<Upload>,
        @InjectModel('Subscription') private readonly SubscriptionModel: Model<Subscription>
  ) { }
   
    

    async addProductWithPhoto(file,  req:any) : Promise<Upload> {
      let parsedProdut:any= {}
      let id =await machineId();
      let upload=false;
      let finduserSubscription:any;
      let user_id=0;
      let start = new Date();
      start.setHours(0,0,0,0);
      let end = new Date();
      end.setHours(23,59,59,999);
      if(req && req.user)
      {
         user_id = req.user.user._id;
      }
      if(user_id!=0)
      {
         parsedProdut.user_id = user_id;
         
          let findTodaySubscription =  await this.SubscriptionModel.countDocuments({user_id:user_id,createdAt:{$gte: start, $lt: end}});
          finduserSubscription =  await this.SubscriptionModel.findOne({user_id:user_id});
         if(finduserSubscription && finduserSubscription.fileCount>0)
         {
            upload=true;
            parsedProdut.subscription_id =  finduserSubscription._id;
         }
         if(findTodaySubscription==0)
         {
            upload = true;
         }
      }
      else 
      {
         parsedProdut.machine_id =   id;
        
         let todayCount  = await this.UploadModel.countDocuments({machine_id:id,createdAt:{$gte: start, $lt: end}})
         console.log("today count "+todayCount)
         if(todayCount==0)
         {
            upload=true;
         }
      }
      if(!upload)
      {
        throw new BadRequestException('Plese subscribe the new plan!');
      }
      const newProduct = new this.UploadModel(parsedProdut);
     if (file) {
       newProduct.filePath = file.path
       // call the deepnude API
       newProduct.deepNudeFile = file.path
     }
     await newProduct.save();
     if(user_id!=0)
     {
       await  finduserSubscription.findByIdAndUpdate(newProduct._id,
        {$inc: {fileCount:-1}}
        )
     }
     return newProduct.toObject({ versionKey: false });
   } 
}
