import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalStatus } from '../common/enums';
import { Rental } from './rental.entity';

@Injectable()
export class RentalsService {
  constructor(@InjectRepository(Rental) private readonly rentals: Repository<Rental>) {}

  active(userId: string) {
    return this.rentals.find({
      where: { user: { id: userId }, status: RentalStatus.ACTIVE },
      order: { endDate: 'ASC' }
    });
  }

  history(userId: string) {
    return this.rentals.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  allActive() {
    return this.rentals.find({
      where: { status: RentalStatus.ACTIVE },
      order: { endDate: 'ASC' }
    });
  }
}
