import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemInput } from '../../cart/dto/cart.inputs';

@InputType()
export class CheckoutInput {
  @Field(() => [CartItemInput])
  @ValidateNested({ each: true })
  @Type(() => CartItemInput)
  items: CartItemInput[];

  @Field()
  @IsString()
  @MinLength(10)
  deliveryAddress: string;

  @Field()
  @IsDateString()
  deliveryDate: string;
}
