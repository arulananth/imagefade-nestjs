import { Controller, Post, Body, Get, Param, Put, Delete, UploadedFile, UseInterceptors, Inject, UseGuards } from '@nestjs/common';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../core/middleware/file-management.middleware';
import { Product } from './product.model';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt'))
@Controller('product')
@ApiTags('Product')
export class ProductsController {
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

  @ApiOperation({ summary: 'addProduct' })
  @Post()
  async addProduct(@Body() productDto: ProductDto, ): Promise<Product> {
    return await this.productsService.addProduct(productDto);
  }

  @ApiOperation({ summary: 'getProducts' })
  @Get()
  async getProducts(): Promise<Product[]> {
    return await this.productsService.getProducts();
  }

  @ApiOperation({ summary: 'getProductById' })
  @Get(':id')
  getProduct(@Param('id') productId: string) {
    return this.productsService.getProductById(productId);
  }

  @ApiOperation({ summary: 'updateCategory' })
  @Put(':id')
  async updateCategory(@Param('id') productId: string, @Body() category: Product): Promise<Product> {
    return this.productsService.updateProduct(productId, category);
  }

  @ApiOperation({ summary: 'removeProduct' })
  @Delete(':id')
  async removeProduct(@Param('id') productId: string) {
    await this.productsService.deleteProduct(productId);
    return null;
  }
}
