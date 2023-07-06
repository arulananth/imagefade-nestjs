import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema, TokenVerifyEmailSchema , } from '../auth/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { SubscriptionSchema } from 'src/pricing/pricing.model';
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name : 'Subscription', schema: SubscriptionSchema},
      { name: 'TokenVerifyEmail', schema: TokenVerifyEmailSchema }
    ])
  ]
})
export class UsersModule {
  
}
