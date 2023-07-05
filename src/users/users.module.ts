import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema, TokenVerifyEmailSchema , } from '../auth/user.model';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'TokenVerifyEmail', schema: TokenVerifyEmailSchema }
    ])
  ]
})
export class UsersModule {
  
}
