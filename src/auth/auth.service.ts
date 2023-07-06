import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenVerifyEmail, User, } from './user.model';
import { v1 as uuidv1 } from 'uuid';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';
import { ForgotpasswordDto } from './dto/forgot-password.dto';
import { ResetpasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
   constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('TokenVerifyEmail') private tokenVerifyEmailModel: Model<TokenVerifyEmail>,
        private jwtService: JwtService,
        private sendEmailMiddleware: SendEmailMiddleware,
    ) { } 

    async createUser(authCredentialsDto: RegisterCredentialsDto) {

        let userToAttempt = await this.findOneByEmail(authCredentialsDto.email);
        if (!userToAttempt) {
            const newUser = new this.userModel({
                email: authCredentialsDto.email,
                password: authCredentialsDto.password,
                emailVerified:true,
                role:authCredentialsDto.role?authCredentialsDto.role:'user'
            });
            return await newUser.save().then((user) => {
                // const newTokenVerifyEmail = new this.tokenVerifyEmailModel({
                //     userId: user._id,
                //     tokenVerifyEmail: uuidv1()
                // });
                // newTokenVerifyEmail.save();

                // this.sendEmailMiddleware.sendEmail(user.email, newTokenVerifyEmail.tokenVerifyEmail, []);
                return user.toObject({ versionKey: false });
            });
        } else {
            return new BadRequestException('Email already exist!');
        }
    }

    async validateUserByPassword(authCredentialsDto: AuthCredentialsDto) {
        let userToAttempt: any = await this.findOneByEmail(authCredentialsDto.email);
        if (!userToAttempt) throw new BadRequestException('Email not found !');
        return new Promise((resolve, reject) => {
            userToAttempt.checkPassword(authCredentialsDto.password, (err, isMatch) => {
                if (err) {
                    reject(new UnauthorizedException());
                }
                if (isMatch) {
                    const payload: any = {
                        token: this.createJwtPayload(userToAttempt),
                    }
                    resolve(payload);
                } else {
                    reject(new BadRequestException(`Password don't match`));
                }
            });
        });
    }
    
    async resetPassword(authCredentialsDto: ResetpasswordDto) {

        let userToAttempt = await this.findOneByEmail(authCredentialsDto.email);
        if (userToAttempt) {
            
            if(userToAttempt.verificationCode == authCredentialsDto.verificationCode)
            {
                let  numberCode:number = Math.floor(Math.random()*90000) + 10000;
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
                    { verificationCode:numberCode ,password:password}
                    );
                  
                        let subject:string = "Password changed successfully!";
                        let html:string="welcome "+userToAttempt.email +" your password is changed successfully!";
                        this.sendEmailMiddleware.sendEmail(userToAttempt.email, subject, html, []);
                    return {message:'Reset password successfully!',success:true};
                   
              

                
           
            }
            else 
            {
                return new BadRequestException('Verification code  incorrect!');
            }
            
            
            
        } else {
            return new BadRequestException('Email not found!');
        }
    }
    async forgotPassword(authCredentialsDto: ForgotpasswordDto) {

        let userToAttempt = await this.findOneByEmail(authCredentialsDto.email);
        if (userToAttempt) {
            let  numberCode:number = Math.floor(Math.random()*90000) + 10000;
           userToAttempt.verificationCode = numberCode.toString();
           await this.userModel.findByIdAndUpdate(
            { _id: userToAttempt._id },
            { verificationCode: numberCode },
            { new: true });
            

            let subject:string = "New password requested sent successfully!";
            let html:string="welcome "+userToAttempt.email +" your new password is requested otp "+numberCode;
            this.sendEmailMiddleware.sendEmail(userToAttempt.email, subject, html, []);
                return {message:'Forgot password request sent successfully!',success:true};
            
        } else {
            return new BadRequestException('Email not found!');
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({ email: email });
    }

    async getAllUsers() {
        return await this.userModel.find();
    }

    async validateUserByJwt(payload: JwtPayload) {
        let user = await this.findOneByEmail(payload.email);
        if (user) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }

    createJwtPayload(user) {
        let data: JwtPayload = {
            _id: user._id,
            role: user.role,
            email: user.email
        };
        return this.jwtService.sign(data);
    }

    async verifyTokenByEmail(token: String) {
        try {
            return await this.tokenVerifyEmailModel.findOne({ tokenVerifyEmail: token })
                .then((data) => {
                    if (data) {
                        return this.userModel.findByIdAndUpdate(
                            { _id: data.userId },
                            { emailVerified: true },
                            { new: true }).then(() => {
                                return true;
                            });
                    } else {
                        return false;
                    }
                });
        } catch (e) {
            console.log('error', e);
        }
    }

}

