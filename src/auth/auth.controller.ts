import { Controller, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from "./user.model";

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'getAllUsers' })
  @Get('/getAllUsers')
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }

  @ApiOperation({ summary: 'signIn' })
  @Post('/signIn')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.validateUserByPassword(authCredentialsDto);
  }

  @ApiOperation({ summary: 'signUp' })
  @Post('/signUp')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.createUser(authCredentialsDto);
  }

  @ApiOperation({ summary: 'verifyTokenByEmail' })
  @Get('/verify/:token')
  async verifyTokenByEmail(@Param('token') token: string) {
    return await this.authService.verifyTokenByEmail(token);
  }

}
