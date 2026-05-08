import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.entity';
import { ProductsService } from '../products/products.service';
import { Rental } from '../rentals/rental.entity';
import { User } from '../users/user.entity';
import { CheckoutInput } from './dto/checkout.input';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrderStatus } from '../common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Rental) private readonly rentals: Repository<Rental>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService
  ) {}

  async checkout(user: User, input: CheckoutInput) {
    const productIds = input.items.map((item) => item.productId);
    const products = await this.products.find({ where: { id: In(productIds), isActive: true } });
    if (products.length !== productIds.length) throw new NotFoundException('One or more products are unavailable');
    const totals = await this.cartService.summarize(input.items);
    const order = this.orders.create({
      user,
      deliveryAddress: input.deliveryAddress,
      deliveryDate: new Date(input.deliveryDate),
      totalMonthlyRent: totals.totalMonthlyRent,
      totalDeposit: totals.totalDeposit,
      items: input.items.map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId)!;
        return this.orderItems.create({
          product,
          quantity: item.quantity,
          tenureMonths: item.tenureMonths,
          monthlyRent: product.monthlyRent,
          deposit: product.deposit
        });
      })
    });
    const saved = await this.orders.save(order);
    for (const item of saved.items) {
      await this.productsService.reduceInventory(item.product.id);
      await this.rentals.save(
        this.rentals.create({
          user,
          order: saved,
          product: item.product,
          tenureMonths: item.tenureMonths,
          startDate: new Date(input.deliveryDate),
          endDate: this.addMonths(new Date(input.deliveryDate), item.tenureMonths)
        })
      );
    }
    return saved;
  }

  listForUser(userId: string) {
    return this.orders.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }

  listAll() {
    return this.orders.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orders.save(order);
  }

  private addMonths(date: Date, months: number) {
    const value = new Date(date);
    value.setMonth(value.getMonth() + months);
    return value;
  }
}
