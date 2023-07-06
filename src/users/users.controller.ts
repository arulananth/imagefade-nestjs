import { Controller, Get, Post, Request, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResetpasswordDto } from '../auth/dto/reset-password.dto';
import { SubscriptionDto } from './dto/subscription.dto';
@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private userService: UsersService) { }

  
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiOperation({ summary: 'getAllUsers' })
  @Get('/getAllUsers')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiOperation({ summary: 'Profile' })
  @Get('/me')
  async myData(@Request() req: any) {
    return await this.userService.myData(req);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiOperation({ summary: 'Change password' })
  @Post('/change-password')
  async changePassword(@Request() req: any, @Body() password:ResetpasswordDto) {
    return await this.userService.changePassword(req,password);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiOperation({ summary: 'Subscription start' })
  @Post('/subscription-start')
  async subscriptionStart(@Request() req: any, @Body() subscription:SubscriptionDto) {
    return await this.userService.subscriptionStart(req,subscription);
  }
}
