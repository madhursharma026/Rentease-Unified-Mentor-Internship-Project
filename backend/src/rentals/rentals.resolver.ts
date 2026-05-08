import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '../common/enums';
import { GqlAuthGuard } from '../common/gql-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { User } from '../users/user.entity';
import { Rental } from './rental.entity';
import { RentalsService } from './rentals.service';

@Resolver(() => Rental)
export class RentalsResolver {
  constructor(private readonly rentalsService: RentalsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Rental])
  activeRentals(@CurrentUser() user: User) {
    return this.rentalsService.active(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Rental])
  rentalHistory(@CurrentUser() user: User) {
    return this.rentalsService.history(user.id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  @Query(() => [Rental])
  adminActiveRentals() {
    return this.rentalsService.allActive();
  }
}
