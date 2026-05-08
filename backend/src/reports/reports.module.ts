import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRequest } from '../maintenance/maintenance-request.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { Rental } from '../rentals/rental.entity';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Rental, MaintenanceRequest, Order])],
  providers: [ReportsService, ReportsResolver]
})
export class ReportsModule {}
