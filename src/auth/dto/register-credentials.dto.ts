import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCredentialsDto {
   
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
   
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    role: string;

    @IsString()
    @ApiProperty()
    googleId: string;

    @IsString()
    @ApiProperty()
    appleId: string;

    @IsString()
    @ApiProperty()
    memberPlan:string;

    @IsString()
    @ApiProperty()
    planExpire:string;
}