import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenVerifyEmail, User, } from './user.model';
import { v1 as uuidv1 } from 'uuid';
import { SendEmailMiddleware } from './../core/middleware/send-email.middleware';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('TokenVerifyEmail') private tokenVerifyEmailModel: Model<TokenVerifyEmail>,
        private jwtService: JwtService,
        private sendEmailMiddleware: SendEmailMiddleware,
    ) { }

    async createUser(authCredentialsDto: AuthCredentialsDto) {

        let userToAttempt = await this.findOneByEmail(authCredentialsDto.email);
        if (!userToAttempt) {
            const newUser = new this.userModel({
                email: authCredentialsDto.email,
                password: authCredentialsDto.password
            });
            return await newUser.save().then((user) => {
                const newTokenVerifyEmail = new this.tokenVerifyEmailModel({
                    userId: user._id,
                    tokenVerifyEmail: uuidv1()
                });
                newTokenVerifyEmail.save();

                this.sendEmailMiddleware.sendEmail(user.email, newTokenVerifyEmail.tokenVerifyEmail, []);
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

