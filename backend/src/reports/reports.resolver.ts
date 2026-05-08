import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from '../common/enums';
import { GqlAuthGuard } from '../common/gql-auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { DashboardMetrics } from './models/dashboard.model';
import { ReportsService } from './reports.service';

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.VENDOR)
  @Query(() => DashboardMetrics)
  dashboardMetrics() {
    return this.reportsService.dashboard();
  }
}
