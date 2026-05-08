import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Category } from '../../common/enums';
import { PaginationInput } from '../../common/pagination.input';

@InputType()
export class ProductFilterInput extends PaginationInput {
  @Field(() => Category, { nullable: true })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  minRent?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  maxRent?: number;
}

@InputType()
export class ProductInput {
  @Field()
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => Category)
  @IsEnum(Category)
  category: Category;

  @Field()
  @IsString()
  description: string;

  @Field(() => Float)
  @Min(0)
  monthlyRent: number;

  @Field(() => Float)
  @Min(0)
  deposit: number;

  @Field(() => [Int])
  @IsInt({ each: true })
  tenureOptions: number[];

  @Field(() => Int)
  @IsInt()
  @Min(0)
  inventoryCount: number;

  @Field()
  @IsString()
  imageUrl: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
