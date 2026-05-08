import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from '../rentals/rental.entity';
import { User } from '../users/user.entity';
import { MaintenanceRequestInput, UpdateMaintenanceInput } from './dto/maintenance.inputs';
import { MaintenanceRequest } from './maintenance-request.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceRequest) private readonly requests: Repository<MaintenanceRequest>,
    @InjectRepository(Rental) private readonly rentals: Repository<Rental>
  ) {}

  async create(user: User, input: MaintenanceRequestInput) {
    const rental = input.rentalId
      ? (await this.rentals.findOne({ where: { id: input.rentalId, user: { id: user.id } } })) || undefined
      : undefined;
    if (input.rentalId && !rental) throw new NotFoundException('Rental not found');
    return this.requests.save(
      this.requests.create({
        user,
        rental,
        product: rental?.product,
        subject: input.subject,
        description: input.description
      })
    );
  }

  myRequests(userId: string) {
    return this.requests.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }

  allRequests() {
    return this.requests.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: string, input: UpdateMaintenanceInput) {
    const request = await this.requests.findOne({ where: { id } });
    if (!request) throw new NotFoundException('Maintenance request not found');
    Object.assign(request, input);
    return this.requests.save(request);
  }
}
