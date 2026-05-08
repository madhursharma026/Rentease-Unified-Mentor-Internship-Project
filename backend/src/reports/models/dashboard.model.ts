import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardMetrics {
  @Field(() => Int)
  totalProducts: number;

  @Field(() => Int)
  activeRentals: number;

  @Field(() => Int)
  openMaintenanceRequests: number;

  @Field(() => Float)
  monthlyRecurringRent: number;

  @Field(() => Float)
  collectedDeposits: number;
}
