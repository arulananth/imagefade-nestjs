import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserblockunblockDto {
    @IsString()
    @ApiProperty()
    user_id: string;

}