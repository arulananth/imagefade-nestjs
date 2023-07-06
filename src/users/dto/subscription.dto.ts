import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionDto {
    @IsString()
    @ApiProperty()
    plan_id: string;

    @IsString()
    @ApiProperty()
    user_id: string;

    @IsString()
    @ApiProperty()
    title: string;

    @IsString()
    @ApiProperty()
    description: string;
    
    @IsNumber()
    @ApiProperty()
    price: number;

    @IsNumber()
    @ApiProperty()
    validDays: number;

    @IsNumber()
    @ApiProperty()
    fileCount?: number;
}