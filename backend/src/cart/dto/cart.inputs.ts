import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsUUID, Min } from 'class-validator';

@InputType()
export class CartItemInput {
  @Field(() => ID)
  @IsUUID()
  productId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  tenureMonths: number;
}
