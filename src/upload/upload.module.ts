import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UsersService } from 'src/users/users.service';
import { UserSchema, TokenVerifyEmailSchema , } from '../auth/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { SubscriptionSchema } from 'src/pricing/pricing.model';
import { ConfigModule } from 'src/core/config/config.module';
import { UploadSchema } from 'src/upload/upload.model';
@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [
    AuthModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Upload', schema: UploadSchema },
      { name : 'Subscription', schema: SubscriptionSchema},
      { name: 'TokenVerifyEmail', schema: TokenVerifyEmailSchema }
    ])
  ]
})
export class UploadModule {}
