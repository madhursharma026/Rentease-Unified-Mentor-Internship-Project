import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartSummary {
  @Field(() => Float)
  totalMonthlyRent: number;

  @Field(() => Float)
  totalDeposit: number;
}
