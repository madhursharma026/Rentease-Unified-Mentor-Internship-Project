import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { Role } from '../common/enums';
import { GqlAuthGuard } from '../common/gql-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { User } from '../users/user.entity';
import { MaintenanceRequestInput, UpdateMaintenanceInput } from './dto/maintenance.inputs';
import { MaintenanceRequest } from './maintenance-request.entity';
import { MaintenanceService } from './maintenance.service';

@Resolver(() => MaintenanceRequest)
export class MaintenanceResolver {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MaintenanceRequest)
  createMaintenanceRequest(@CurrentUser() user: User, @Args('input') input: MaintenanceRequestInput) {
    return this.maintenanceService.create(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [MaintenanceRequest])
  myMaintenanceRequests(@CurrentUser() user: User) {
    return this.maintenanceService.myRequests(user.id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  @Query(() => [MaintenanceRequest])
  maintenanceRequests() {
    return this.maintenanceService.allRequests();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  @Mutation(() => MaintenanceRequest)
  updateMaintenanceRequest(@Args('id', { type: () => ID }) id: string, @Args('input') input: UpdateMaintenanceInput) {
    return this.maintenanceService.update(id, input);
  }
}
