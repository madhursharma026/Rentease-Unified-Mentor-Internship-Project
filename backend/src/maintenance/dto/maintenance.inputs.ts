import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { MaintenanceStatus } from '../../common/enums';

@InputType()
export class MaintenanceRequestInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  rentalId?: string;

  @Field()
  @IsString()
  @MinLength(4)
  subject: string;

  @Field()
  @IsString()
  @MinLength(10)
  description: string;
}

@InputType()
export class UpdateMaintenanceInput {
  @Field(() => MaintenanceStatus)
  @IsEnum(MaintenanceStatus)
  status: MaintenanceStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}
