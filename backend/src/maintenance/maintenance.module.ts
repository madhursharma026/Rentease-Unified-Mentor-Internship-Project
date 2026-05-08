import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from '../rentals/rental.entity';
import { MaintenanceRequest } from './maintenance-request.entity';
import { MaintenanceResolver } from './maintenance.resolver';
import { MaintenanceService } from './maintenance.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRequest, Rental])],
  providers: [MaintenanceService, MaintenanceResolver],
  exports: [MaintenanceService]
})
export class MaintenanceModule {}
