import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
    @IsString()
    @ApiProperty()
    editFilename: File;

    @IsString()
    @ApiProperty()
    user_id: string;
    
   
}