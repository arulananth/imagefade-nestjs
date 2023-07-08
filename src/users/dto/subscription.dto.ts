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
    coinPrice: number;

    @IsNumber()
    @ApiProperty()
    validDays: number;

    @IsNumber()
    @ApiProperty()
    fileCount?: number;

    @IsString()
    @ApiProperty()
    network: string;

    @IsString()
    @ApiProperty()
    address: string;

    @IsString()
    @ApiProperty()
    blockchain: string;

    @IsString()
    @ApiProperty()
    transactionId: string;

    @IsString()
    @ApiProperty()
    status: string;

    @IsString()
    @ApiProperty()
    lastVerify: Date;
}