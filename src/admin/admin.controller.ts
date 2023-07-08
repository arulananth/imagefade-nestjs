
import { Controller, Get, Post, Request, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResetpasswordDto } from '../auth/dto/reset-password.dto';
import { SubscriptionDto } from '../users/dto/subscription.dto';
import { AdminService } from './admin.service';
import { UserblockunblockDto } from './dto/user-block-unblock.dto';	
@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard,RolesGuard)
export class AdminController {
  constructor(private userService: UsersService,private adminService: AdminService) { }


  @ApiOperation({ summary: 'Dashboard' })
  @Get('/dashboard')
  async dashboardData(@Request() req: any) {
    return await this.adminService.dashboardData();
  }

  @ApiOperation({ summary: 'getAllUsers' })
  @Get('/getAllUsers')
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

  @ApiOperation({ summary: 'Users Block/Unblock' })
  @Post('/user-unblock-block')
  async changePassword(@Body() payload:UserblockunblockDto) {
    return await this.adminService.userBlocUnBlock(payload);
  }

  
  @ApiOperation({ summary: 'Upload History' })
  @Post('/upload-history')
  async adminUploadHistory() {
    return await this.adminService.getAllHistory();
  }

  @ApiOperation({ summary: 'Subscription verify' })
  @Post('/subscription-verify')
  async subscriptionCheck(@Body() subscription:SubscriptionDto) {
    return await this.adminService.checkTransaction(subscription);
  }
 
  @ApiOperation({ summary: 'Subscription all users' })
  @Post('/subscription-list')
  async subscriptionListbyId(@Request() req: any, @Body() subscription:SubscriptionDto) {
    return await this.adminService.subscriptionList(subscription);
  }
}
