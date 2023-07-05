import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetpasswordDto {
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string;
    
    @IsString()
    @IsEmail()
    @ApiProperty()
    verificationCode: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    confirmPassword: string;

    
}