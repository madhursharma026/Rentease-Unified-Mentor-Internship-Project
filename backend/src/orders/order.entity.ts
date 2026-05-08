import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../common/enums';
import { User } from '../users/user.entity';
import { OrderItem } from './order-item.entity';

@ObjectType()
@Entity('orders')
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalMonthlyRent: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalDeposit: number;

  @Field()
  @Column()
  deliveryAddress: string;

  @Field()
  @Column()
  deliveryDate: Date;

  @Field(() => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
