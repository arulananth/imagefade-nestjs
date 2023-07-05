import { Controller, Get, Post, Body, Put, ValidationPipe, Query, Req, Res, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

}
