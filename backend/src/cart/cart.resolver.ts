import { Args, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartItemInput } from './dto/cart.inputs';
import { CartSummary } from './models/cart-summary.model';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartSummary)
  cartSummary(@Args('items', { type: () => [CartItemInput] }) items: CartItemInput[]) {
    return this.cartService.summarize(items);
  }
}
