import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('DB_USER')}:${encodeURIComponent(configService.get('DB_PWD'))}@${configService.get('DB_URI')}/${configService.get('DB_NAME')}`,
        useNewUrlParser: true
      }),
      inject: [ConfigService]
    }),
    AuthModule,ProductsModule,
    WinstonModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
  static port: number | string;
  constructor(private _configService: ConfigService) {
    AppModule.port = this._configService.get('PORT');
    console.log('AppModule.port', AppModule.port);
  }
}
