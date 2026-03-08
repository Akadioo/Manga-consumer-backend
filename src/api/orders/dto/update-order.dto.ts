import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paymentDate?: Date | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentGatewayTransactionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  payerEmail?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  paymentData?: any;
}
