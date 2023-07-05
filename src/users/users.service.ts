
import { Injectable, UnauthorizedException, BadRequestException, ArgumentsHost } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokenVerifyEmail, User } from "../auth/user.model"
@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
      
    ) { }
    async getAllUsers() {
        return await this.userModel.find();
    }
}
