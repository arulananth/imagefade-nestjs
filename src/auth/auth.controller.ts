import { Controller, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { ForgotpasswordDto } from './dto/forgot-password.dto';
import { ResetpasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from "./user.model";

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private authService: AuthService) { }

  

  @ApiOperation({ summary: 'signIn' })
  @Post('/signIn')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.validateUserByPassword(authCredentialsDto);
  }

  @ApiOperation({ summary: 'signUp' })
  @Post('/signUp')
  async signUp(@Body() authCredentialsDto: RegisterCredentialsDto) {
    return await this.authService.createUser(authCredentialsDto);
  }
  
  @ApiOperation({ summary: 'Forgot Password' })
  @Post('/forgotpassword')
  async forgotPassword(@Body() authCredentialsDto: ForgotpasswordDto) {
    return await this.authService.forgotPassword(authCredentialsDto);
  }

  @ApiOperation({ summary: 'Reset Password' })
  @Post('/resetpassword')
  async resetPassword(@Body() authCredentialsDto: ResetpasswordDto) {
    return await this.authService.resetPassword(authCredentialsDto);
  }

  @ApiOperation({ summary: 'verifyTokenByEmail' })
  @Get('/verify/:token')
  async verifyTokenByEmail(@Param('token') token: string) {
    return await this.authService.verifyTokenByEmail(token);
  }

}
