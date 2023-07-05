import { Controller, Post, Body, Get, Param, Put, Delete, UploadedFile, UseInterceptors, Inject, UseGuards } from '@nestjs/common';
import { diskStorage } from 'multer';
import { ProductsService } from './pricing.service';
import { ProductDto } from './dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../core/middleware/file-management.middleware';
import { Price } from './pricing.model';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
// @UseGuards(AuthGuard('jwt'))
@Controller('pricing')
@ApiTags('Pricing')
export class PricingsController {
  constructor( private readonly productsService: ProductsService) { }

  // addProduct with file "photo" data sent as formData
 /*  @Post('/withPhoto')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async addProductWithPhoto(@UploadedFile() file, @Body() productDto: ProductDto, ): Promise<Product> {
    return await this.productsService.addProductWithPhoto(file, productDto);
  } */

  // addProduct without file "photo" data sent as json 

  @ApiOperation({ summary: 'addPricing' })
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post()
  async addProduct(@Body() productDto: ProductDto, ): Promise<Price> {
    return await this.productsService.addPrice(productDto);
  }

  @ApiOperation({ summary: 'getPricings' })
  @Get()
  async getProducts(): Promise<Price[]> {
    return await this.productsService.getPricings();
  }

  @ApiOperation({ summary: 'getPricingById' })
  @Get(':id')
  getProduct(@Param('id') productId: string) {
    return this.productsService.getPricedById(productId);
  }
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiOperation({ summary: 'updatePricing' })
  @Put(':id')
  async updateCategory(@Param('id') productId: string, @Body() category: Price): Promise<Price> {
    return this.productsService.updatePricing(productId, category);
  }
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiOperation({ summary: 'removePricing' })
  @Delete(':id')
  async removeProduct(@Param('id') productId: string) {
    await this.productsService.deletePricing(productId);
    return null;
  }
}
