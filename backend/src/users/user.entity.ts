import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../common/enums';
import { Order } from '../orders/order.entity';
import { Rental } from '../rentals/rental.entity';
import { MaintenanceRequest } from '../maintenance/maintenance-request.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Rental[];

  @OneToMany(() => MaintenanceRequest, (request) => request.user)
  maintenanceRequests: MaintenanceRequest[];
}
