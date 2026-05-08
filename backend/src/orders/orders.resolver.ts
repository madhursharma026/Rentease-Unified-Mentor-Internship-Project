import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { OrderStatus, Role } from '../common/enums';
import { GqlAuthGuard } from '../common/gql-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { User } from '../users/user.entity';
import { CheckoutInput } from './dto/checkout.input';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Order)
  checkout(@CurrentUser() user: User, @Args('input') input: CheckoutInput) {
    return this.ordersService.checkout(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Order])
  myOrders(@CurrentUser() user: User) {
    return this.ordersService.listForUser(user.id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  @Query(() => [Order])
  orders() {
    return this.ordersService.listAll();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  @Mutation(() => Order)
  updateOrderStatus(@Args('id') id: string, @Args('status', { type: () => OrderStatus }) status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }
}
