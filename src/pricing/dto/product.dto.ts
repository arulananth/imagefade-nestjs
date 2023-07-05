import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
    @IsString()
    @ApiProperty()
    title: string;

    @IsString()
    @ApiProperty()
    description: string;
    
    @IsNumber()
    @ApiProperty()
    validDays: number;

    @IsNumber()
    @ApiProperty()
    price: number;

    @IsNumber()
    @ApiProperty()
    fileCount?: number;
}