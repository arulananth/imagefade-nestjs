
import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResetpasswordDto } from '../auth/dto/reset-password.dto';

import {  User, } from '../auth/user.model';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
       
    ) { } 
    async getAllUsers() {
        return await this.userModel.find();
    }
    async myData(payload) {
       
        return await this.userModel.findOne({_id:payload.user.user._id});
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
