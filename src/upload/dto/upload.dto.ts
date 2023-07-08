import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
   
    @IsString()
    @ApiProperty()
    user_id: string;
    
   
}