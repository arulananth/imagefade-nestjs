import { Controller,  Post, Body, Get, Param, Request, Put, Delete, UploadedFile, UseInterceptors, Inject, UseGuards } from '@nestjs/common';
import { diskStorage } from 'multer';

import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../core/middleware/file-management.middleware';
import { UploadService } from './upload.service';
import { ApiTags, ApiBearerAuth, ApiOperation ,ApiConsumes, ApiBody} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Upload } from './upload.model';
import { UploadDto } from './dto/upload.dto';
@Controller('upload')
@ApiTags('Upload')
export class UploadController {
    constructor(private uploadService:UploadService) { }
    // addProduct with file "photo" data sent as formData
  @Post('/withPhoto')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  
  @ApiBody(
    
    {
    required: true,
    type: "multipart/form-data",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  async addProductWithPhoto(@UploadedFile() file,  @Request() req): Promise<Upload> {
    return await this.uploadService.addProductWithPhoto(file, req);
  } 
}
