import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MaintenanceStatus } from '../common/enums';
import { Product } from '../products/product.entity';
import { Rental } from '../rentals/rental.entity';
import { User } from '../users/user.entity';

@ObjectType()
@Entity('maintenance_requests')
export class MaintenanceRequest {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.maintenanceRequests, { eager: true })
  user: User;

  @Field(() => Rental, { nullable: true })
  @ManyToOne(() => Rental, { eager: true, nullable: true })
  rental?: Rental;

  @Field(() => Product, { nullable: true })
  @ManyToOne(() => Product, { eager: true, nullable: true })
  product?: Product;

  @Field()
  @Column()
  subject: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => MaintenanceStatus)
  @Column({ type: 'enum', enum: MaintenanceStatus, default: MaintenanceStatus.OPEN })
  status: MaintenanceStatus;

  @Field({ nullable: true })
  @Column({ nullable: true })
  assignedTo?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
