
import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResetpasswordDto } from 'src/auth/dto/reset-password.dto';
import { SubscriptionDto } from 'src/users/dto/subscription.dto';
import {  User } from '../auth/user.model';
import { Upload } from 'src/upload/upload.model';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/pricing/pricing.model';
const https = require("https");
import { ConfigService } from 'src/core/config/config.service';
import {machineId, machineIdSync} from 'node-machine-id';
import { UserblockunblockDto } from './dto/user-block-unblock.dto';	

@Injectable()
export class AdminService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Upload') private uploadModel: Model<User>,
        @InjectModel('Subscription') private subscriptionModel: Model <Subscription>,
        private config:ConfigService
        ) 
        { 
       
        } 
  
    async getAllUsers() {
       
        return await this.userModel.find();
    }
    async getAllHistory() {
       
        return await this.uploadModel.find().populate("user_id");
    }
    async dashboardData() {
        let usersCount:any = await this.userModel.countDocuments();
        let uploadCount:any = await this.uploadModel.countDocuments();
        let subscriptionCount:any= await this.subscriptionModel.find({status:1}).countDocuments();
         let subscriptionSum:any= await this.subscriptionModel.aggregate([  
            { $match: {status:"1"}},
            { $group:
             { _id : null, sum : { $sum: "$price" } }
          }])
          

        return {
            usersCount: usersCount,
            uploadCount: uploadCount,
            subscriptionCount: subscriptionCount,
            subscriptionTotal:subscriptionSum
        }
    }
    async subscriptionList(authCredentialsDto:SubscriptionDto) 
    {
        let transaction:any= await this.subscriptionModel.find({status:1}).sort({"createdAt":-1})
        .populate("user_id")
        .populate("plan_id");
         return transaction;
    }
    async addDays (days, date = new Date()) {  
        date.setDate(date.getDate() + days)
      
        return date
      }
    async subscriptionStart(payload,authCredentialsDto:SubscriptionDto) 
    {
        let transaction:any= await this.subscriptionModel.findOne({transactionId:authCredentialsDto.transactionId});
        
        if(transaction)
        {
             throw new BadRequestException('TransactionID is exits!');
        }
        let user:any= await this.userModel.findOne({_id:payload.user.user.id});
        let newDate:any = new Date();
        
        let newSubscription = this.subscriptionModel({
             plan_id: authCredentialsDto.plan_id,
             user_id: authCredentialsDto.user_id,
             price : authCredentialsDto.price,
             fileCount : authCredentialsDto.fileCount,
             title  : authCredentialsDto.title,
             description : authCredentialsDto.description,
             validDays:authCredentialsDto.validDays,
             coinPrice:authCredentialsDto.coinPrice,
             transactionId:authCredentialsDto.transactionId,
             network: authCredentialsDto.network,
             blockchain:authCredentialsDto.blockchain,
             addresss:authCredentialsDto.address,
             status:authCredentialsDto.status
        })
        await newSubscription.save();
        
       let paymentRequest = await this.VerifythePayment(authCredentialsDto.plan_id,authCredentialsDto.validDays,authCredentialsDto.user_id,authCredentialsDto.blockchain,authCredentialsDto.network,authCredentialsDto.transactionId,authCredentialsDto,newSubscription._id)
       return {paymentRequest:paymentRequest,subscription:newSubscription};
       
    }
   
    async  checkTransaction(subscription:any)
    {
        let subscriptionId:string=subscription.subscriptionId;
        let subscriptionCheck:any= await this.subscriptionModel.findOne({_id:subscriptionId});
        if(!subscriptionCheck)
        {
            throw new BadRequestException('Subscription is invalid!');
        }
        if(subscriptionCheck && subscriptionCheck.status =="1")
        {
            throw new BadRequestException('Subscription is already updated the membership!');
        }
        let paymentRequest = await this.VerifythePayment(subscription.plan_id,subscription.validDays,subscription.user_id,subscription.blockchain,subscription.network,subscription.transactionId,subscription,subscription._id)
        
        return {paymentRequest:paymentRequest,subscription:subscription};
    }
    async VerifythePayment(plan_id,validDays:number,user_id:string,blockchain:string,network:string,transactionId:string,obj:any,subscriptionId:string)
    {
        
        
        let transactionLast:any= await this.subscriptionModel.findOne({user_id:user_id,status:1}).sort({createdAt:-1});
        let expireDateLast= new Date();
        if(transactionLast)
        {
            expireDateLast = transactionLast.expireDate;
        }
       
        expireDateLast = await this.addDays(validDays,new Date(expireDateLast));
       
            var options = {
            "method": "GET",
            "hostname": "rest.cryptoapis.io",
            "path": "/v2/blockchain-data/"+blockchain+"/"+network+"/transactions/"+transactionId,
            "qs": {"context":JSON.stringify(obj)},
            "headers": {
                "Content-Type": "application/json",
                "X-API-Key": this.config.get('cryptokey')
            }
            };

            var objCall = this;
        return new Promise((resolve, reject) => {
            var req = https.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () 
            {
                var body = Buffer.concat(chunks);
                let apiResponse = JSON.parse(body.toString());
                let newExpireDate = new Date();
                let status="1";
                if(apiResponse && apiResponse.error && apiResponse.error.code)
                {
                    status="2";
                    expireDateLast=null;
                }
                else 
                {
                    objCall.userModel.findByIdAndUpdate(user_id,
                    {
                        subscriptionId:subscriptionId,
                        membershipId:plan_id
                        
                    }).then(function(doc,err){
                        console.log(err)
                       
                    })
                    
                }
               
                    objCall.subscriptionModel.findByIdAndUpdate(subscriptionId,{
                        status:status,
                        lastVerify: new Date(),
                        cryptoData:apiResponse,
                        expireDate:expireDateLast
                    }).then(function(doc,err){
                        console.log(err)
                     
                    });
                
                resolve({success:true,status:status,newDate:expireDateLast, cryptoData:apiResponse});
            });
            res.on('error', function (){
                reject({success:false,status:status, cryptoData:{},error:{code:'400',message:'Invalid API'}})
            })
            });
           
            req.end();
        });
    }
   
    async userBlocUnBlock(payload:UserblockunblockDto) 
    {
        let userToAttempt = await this.userModel.findOne({_id:payload.user_id});
        if(!userToAttempt)
        {
                    throw new BadRequestException('Invalid user!');
        }
        let emailVerified=true;
       
            
            if(userToAttempt.emailVerified)
            {
                emailVerified=false;
            }
             await  this.userModel.findByIdAndUpdate(
                    userToAttempt._id,
                    { emailVerified:emailVerified}
                    );
                 
        return {message:'User status successfully updated!',success:true};
       
    }
}
