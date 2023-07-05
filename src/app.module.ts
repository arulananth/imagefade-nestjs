import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { AuthModule } from './auth/auth.module';
import { PricingsModule } from './pricing/pricing.module';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { PagesModule } from './pages/pages.module';
import { RolesGuard } from './auth/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
 
  imports: [
   
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DB_USER')}:${encodeURIComponent(configService.get('DB_PWD'))}@${configService.get('DB_URI')}/${configService.get('DB_NAME')}`,
        useNewUrlParser: true
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    JwtModule.register({secret:'secrete', signOptions:{expiresIn: '2h'}}),
    PricingsModule,
    WinstonModule,
    UsersModule,
    UploadModule,
    PagesModule
  ],
  controllers: [],
  providers: [
  
   
  ],
})

export class AppModule {
  static port: number | string;
  constructor(private _configService: ConfigService) {
    AppModule.port = this._configService.get('PORT');
    console.log('AppModule.port', AppModule.port);
  }
}
