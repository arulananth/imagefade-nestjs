
import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResetpasswordDto } from '../auth/dto/reset-password.dto';
import { SubscriptionDto } from './dto/subscription.dto';
import {  User, } from '../auth/user.model';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/pricing/pricing.model';
@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Subscription') private subscriptionModel: Model <Subscription>,
       
    ) { } 
    async getAllUsers() {
        return await this.userModel.find();
    }
    async myData(payload) {
       
        return await this.userModel.findOne({_id:payload.user.user._id});
    }
    async subscriptionStart(payload,authCredentialsDto:SubscriptionDto) 
    {
        let user:any= await this.userModel.findOne(payload.user.user.id);
        let newDate:any = new Date();
        let newSubscription = this.subscriptionModel({
             plan_id: authCredentialsDto.plan_id,
             user_id: authCredentialsDto.user_id,
             price : authCredentialsDto.price,
             fileCount : authCredentialsDto.fileCount,
             title  : authCredentialsDto.title,
             description : authCredentialsDto.description,
             expireDate: newDate
        })
        await newSubscription.save();
        return newSubscription.toObject({ versionKey: false });
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
