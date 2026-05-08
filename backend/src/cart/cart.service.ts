import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { CartItemInput } from './dto/cart.inputs';

@Injectable()
export class CartService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  async summarize(items: CartItemInput[]) {
    const productIds = items.map((item) => item.productId);
    const products = await this.products.find({ where: { id: In(productIds) } });
    if (products.length !== productIds.length) throw new NotFoundException('Cart contains unavailable products');
    const totals = items.reduce(
      (acc, item) => {
        const product = products.find((candidate) => candidate.id === item.productId)!;
        acc.totalMonthlyRent += Number(product.monthlyRent) * item.quantity;
        acc.totalDeposit += Number(product.deposit) * item.quantity;
        return acc;
      },
      { totalMonthlyRent: 0, totalDeposit: 0 }
    );
    return totals;
  }
}
