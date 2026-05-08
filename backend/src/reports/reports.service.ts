import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceStatus, RentalStatus } from '../common/enums';
import { MaintenanceRequest } from '../maintenance/maintenance-request.entity';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { Rental } from '../rentals/rental.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Rental) private readonly rentals: Repository<Rental>,
    @InjectRepository(MaintenanceRequest) private readonly maintenance: Repository<MaintenanceRequest>,
    @InjectRepository(Order) private readonly orders: Repository<Order>
  ) {}

  async dashboard() {
    const [totalProducts, activeRentals, openMaintenanceRequests, orders] = await Promise.all([
      this.products.count(),
      this.rentals.count({ where: { status: RentalStatus.ACTIVE } }),
      this.maintenance.count({ where: { status: MaintenanceStatus.OPEN } }),
      this.orders.find()
    ]);
    return {
      totalProducts,
      activeRentals,
      openMaintenanceRequests,
      monthlyRecurringRent: orders.reduce((sum, order) => sum + Number(order.totalMonthlyRent), 0),
      collectedDeposits: orders.reduce((sum, order) => sum + Number(order.totalDeposit), 0)
    };
  }
}
