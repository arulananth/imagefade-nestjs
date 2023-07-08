import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { UserSchema, TokenVerifyEmailSchema , } from '../auth/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { SubscriptionSchema } from 'src/pricing/pricing.model';
import { ConfigModule } from 'src/core/config/config.module';
import { UploadSchema } from 'src/upload/upload.model';

@Module({
  controllers: [AdminController],
  providers: [AdminService,UsersService],
  imports: [
    AuthModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name : 'Subscription', schema: SubscriptionSchema},
      { name: 'TokenVerifyEmail', schema: TokenVerifyEmailSchema },
      { name: 'Upload', schema: UploadSchema }
    ])
  ]
})
export class AdminModule {}
