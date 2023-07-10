
import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResetpasswordDto } from '../auth/dto/reset-password.dto';
import { SubscriptionDto } from './dto/subscription.dto';
import {  User, } from '../auth/user.model';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/pricing/pricing.model';
const https = require("https");
import { ConfigService } from 'src/core/config/config.service';
import {machineId, machineIdSync} from 'node-machine-id';
import { Upload } from 'src/upload/upload.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Upload') private uploadModel: Model<Upload>,
        @InjectModel('Subscription') private subscriptionModel: Model <Subscription>,
        private config:ConfigService
       
    ) { 
       
    } 
    async uploadList(req:any)
    {
        return await this.uploadModel.find({user_id:req.user.user._id}).populate("user_id");
    }
    async machineHistory()
    {
        let id = await machineId();

        return await this.uploadModel.find({machine_id:id});
    }
    async mySystemId() {
        let id = await machineId();
        let start = new Date();
        start.setHours(0,0,0,0);
        let end = new Date();
        end.setHours(23,59,59,999);
        let todayCount  = await this.uploadModel.countDocuments({machine_id:id,createdAt:{$gte: start, $lt: end}})
        return {id: id, todayCount: todayCount};
    }
    
    async myData(payload) {
        let id = await machineId();
        console.log("machine "+id)
        return await this.userModel.findOne({_id:payload.user.user._id})
        .populate("membershipId")
        .populate("subscriptionId");
    }
    async subscriptionList(payload,authCredentialsDto:SubscriptionDto) 
    {
        let transaction:any= await this.subscriptionModel.find({user_id:payload.user.user.id}).sort({"createdAt":-1,"status":1}).populate("user_id");
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
   
    async  checkTransaction(payload:any,subscription:any)
    {
        let subscriptionId:string=subscription.subscriptionId?subscription.subscriptionId:subscription._id;
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
        let currentSub=await this.subscriptionModel.findOne({_id:subscriptionId});
        let expireDateLast= new Date();
        let exitCount=0;
        if(transactionLast)
        {
            expireDateLast = transactionLast.expireDate;
            exitCount = transactionLast.fileCount;
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
                        fileCount:exitCount+currentSub.fileCount,
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
   
    async changePassword(payload,authCredentialsDto:ResetpasswordDto) {
       
        

        let userToAttempt = await this.userModel.findOne({_id:payload.user.user._id});
        if (userToAttempt) {
            
            if(userToAttempt.email == payload.user.user.email)
            {
               
                let salt =  await bcrypt.genSalt(10);
                if(!salt)
                {
                    return new BadRequestException('Password algorithum is falied');
                }
                let password = await bcrypt.hash(authCredentialsDto.password, salt);
                if(!password)
                {
                    return new BadRequestException('Password hash is falied');
                }
                
                await  this.userModel.findByIdAndUpdate(
                    userToAttempt._id,
                    { password:password}
                    );
                  
                       
                    return {message:'Password changed successfully!',success:true};
               
            }
            else 
            {
                return new BadRequestException('Verification code  incorrect!');
            }
            
            
            
        } else {
            return new BadRequestException('Email not found!');
        }
    
}
}
