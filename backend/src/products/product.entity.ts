import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../common/enums';

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  slug: string;

  @Field(() => Category)
  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyRent: number;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  deposit: number;

  @Field(() => [Int])
  @Column({ type: 'simple-array' })
  tenureOptions: number[];

  @Field(() => Int)
  @Column({ default: 0 })
  inventoryCount: number;

  @Field()
  @Column()
  imageUrl: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
