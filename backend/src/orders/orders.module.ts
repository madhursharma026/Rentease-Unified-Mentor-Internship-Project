import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { Product } from '../products/product.entity';
import { ProductsModule } from '../products/products.module';
import { Rental } from '../rentals/rental.entity';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, Rental]), CartModule, ProductsModule],
  providers: [OrdersService, OrdersResolver],
  exports: [OrdersService, TypeOrmModule]
})
export class OrdersModule {}
