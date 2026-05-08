import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './rental.entity';
import { RentalsResolver } from './rentals.resolver';
import { RentalsService } from './rentals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rental])],
  providers: [RentalsService, RentalsResolver],
  exports: [RentalsService, TypeOrmModule]
})
export class RentalsModule {}
