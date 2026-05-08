import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RentalStatus } from '../common/enums';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@ObjectType()
@Entity('rentals')
export class Rental {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.rentals, { eager: true })
  user: User;

  @Field(() => Order)
  @ManyToOne(() => Order, { eager: true })
  order: Order;

  @Field(() => Product)
  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Field(() => Int)
  @Column()
  tenureMonths: number;

  @Field()
  @Column()
  startDate: Date;

  @Field()
  @Column()
  endDate: Date;

  @Field(() => RentalStatus)
  @Column({ type: 'enum', enum: RentalStatus, default: RentalStatus.ACTIVE })
  status: RentalStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
