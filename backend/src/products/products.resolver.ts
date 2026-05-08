import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from '../common/enums';
import { GqlAuthGuard } from '../common/gql-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { ProductInput, ProductFilterInput } from './dto/product.inputs';
import { ProductPage } from './models/product-page.model';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => ProductPage)
  products(@Args('filter', { nullable: true }) filter: ProductFilterInput = new ProductFilterInput()) {
    return this.productsService.findAll(filter);
  }

  @Query(() => Product)
  product(@Args('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  @Mutation(() => Product)
  createProduct(@Args('input') input: ProductInput) {
    return this.productsService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  @Mutation(() => Product)
  updateProduct(@Args('id', { type: () => ID }) id: string, @Args('input') input: ProductInput) {
    return this.productsService.update(id, input);
  }
}
