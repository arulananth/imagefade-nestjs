import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PricingDto } from './dto/product.dto';
import { Price } from './pricing.model';
import { AppLogger } from '../core/services/logger.service';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(@InjectModel('Product') private readonly productModel: Model<Price>, private appLogger: AppLogger
  ) { }

  onModuleInit() {
    console.log(`The module has been initialized.`);
   
  }

  // addProduct with file "photo"

 /*   async addProductWithPhoto(file, productDto: any) : Promise<Product> {
      let parsedProdut = JSON.parse(productDto.product);
     console.log('productDto',productDto.product);
 
     const newProduct = new this.productModel(parsedProdut);
     if (file) {
       newProduct.filePath = file.path
     }
     await newProduct.save();
     return newProduct.toObject({ versionKey: false });
   } */

  // addProduct without file "photo"
  async addPrice(productDto: PricingDto): Promise<Price> {
    const newProduct = new this.productModel(productDto);
    await newProduct.save();
    return newProduct.toObject({ versionKey: false });
  }

  async getPricings(): Promise<Price[]> {
    this.appLogger.warn(' getProducts ')
    this.appLogger.error(' getProducts ', 'test')
    this.appLogger.log(' getProducts ')
    return await this.productModel.find();
  }

  async getPricedById(productId: string): Promise<Price> {
    return await this.productModel.findById({ _id: productId });
  }

  async updatePricing(productId: string, product: Partial<Price>): Promise<Price> {
    return this.productModel.findByIdAndUpdate({ _id: productId }, product, { new: true });
  }

  async deletePricing(prodId: string): Promise<void> {
    return await this.productModel.deleteOne({ _id: prodId })
  }

}
