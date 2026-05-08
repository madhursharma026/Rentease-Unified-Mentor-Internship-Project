import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN'
}

export enum Category {
  FURNITURE = 'FURNITURE',
  APPLIANCES = 'APPLIANCES'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum RentalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum MaintenanceStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED'
}

registerEnumType(Role, { name: 'Role' });
registerEnumType(Category, { name: 'Category' });
registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(RentalStatus, { name: 'RentalStatus' });
registerEnumType(MaintenanceStatus, { name: 'MaintenanceStatus' });
