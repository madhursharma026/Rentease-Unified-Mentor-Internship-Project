import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Order } from './order.entity';

@ObjectType()
@Entity('order_items')
export class OrderItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Field(() => Product)
  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => Int)
  @Column()
  tenureMonths: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyRent: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  deposit: number;
}
