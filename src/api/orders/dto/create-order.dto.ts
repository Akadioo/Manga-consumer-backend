import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsNotEmpty,
  Min,
  Max,
  Length,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailDto } from './create-order-detail.dto';

export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID del usuario que realiza el pedido',
    example: 'd8fcb6ee-3799-4d5a-badb-0a5c84b34109',
  })
  @IsUUID('4', { message: 'El ID de usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El campo userId es obligatorio' })
  userId: string;

  @ApiProperty({
    description: 'ID de la dirección de envío asociada al pedido',
    example: 'f8dcb6ee-1234-4d5a-badb-0a5c84b341aa',
  })
  @IsUUID('4', { message: 'El ID de dirección debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El campo addressId es obligatorio' })
  addressId: string;

  @ApiProperty({
    description: 'Tipo de documento del pedido (Boleta o Factura)',
    example: 'Boleta',
    enum: ['Boleta', 'Factura'],
  })
  @IsString({ message: 'El tipo de documento debe ser texto' })
  @IsIn(['Boleta', 'Factura'], {
    message: 'El tipo debe ser "Boleta" o "Factura"',
  })
  @IsNotEmpty({ message: 'El campo type es obligatorio' })
  type: string;

  @ApiProperty({
    description: 'Método de pago utilizado (por defecto MercadoPago)',
    example: 'MercadoPago',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El método de pago debe ser texto' })
  @Length(3, 50, {
    message: 'El método de pago debe tener entre 3 y 50 caracteres',
  })
  paymentGateway?: string;

  @ApiProperty({
    description: 'Monto total del pedido (máximo 10 millones)',
    example: 34990,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio total debe ser numérico con máximo 2 decimales' },
  )
  @Min(0, { message: 'El monto total no puede ser negativo' })
  @Max(10000000, { message: 'El monto total no puede superar los 10 millones' })
  @IsNotEmpty({ message: 'El campo totalPrice es obligatorio' })
  totalPrice: number;

  @ApiProperty({
    description: 'ID de la transacción en el gateway de pago (si aplica)',
    example: 'pay_1234567890',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El ID de transacción debe ser texto' })
  @Length(3, 255, {
    message: 'El ID de transacción debe tener entre 3 y 255 caracteres',
  })
  paymentGatewayTransactionId?: string;

  @ApiProperty({
    description: 'Estado del pago (Pending, Paid, Failed)',
    example: 'Pending',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El estado de pago debe ser texto' })
  @IsIn(['Pending', 'Paid', 'Failed'], {
    message: 'El estado de pago debe ser "Pending", "Paid" o "Failed"',
  })
  paymentStatus?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  details: CreateOrderDetailDto[];
}
