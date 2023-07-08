import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PricingsController } from './pricings.controller';
import { ProductsService } from './pricing.service';
import { PriceSchema, SubscriptionSchema } from './pricing.model';
import { MulterModule } from '@nestjs/platform-express';
import { WinstonModule,  } from 'nest-winston';
import { AppLogger } from '../core/services/logger.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    MongooseModule.forFeature([
      { name: 'Price', schema: PriceSchema },
      { name :'Subscription', schema: SubscriptionSchema}]),
    WinstonModule
  ],
  controllers: [PricingsController],
  providers: [ProductsService, AppLogger],
})
export class PricingsModule { }
