import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from './create-order.dto';
import { IsOptional } from 'class-validator';

export class ReadOrderDto {
  @ApiPropertyOptional({
    description: 'ID único de la orden',
    example: 'b3e64a6c-2b79-4e94-8c4f-0a2a8f40b8ef',
  })
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    description: 'Número de boleta o factura autogenerado',
    example: 125,
  })
  @IsOptional()
  orderNumber?: number;

  @ApiPropertyOptional({
    description: 'Fecha en que se generó la orden',
    example: '2025-11-06T22:00:00.000Z',
  })
  @IsOptional()
  orderDate?: Date;

  @ApiPropertyOptional({
    description: 'Estado actual del pedido',
    enum: OrderStatus,
    example: 'PENDING',
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Precio total de la orden',
    example: 34990.5,
  })
  @IsOptional()
  totalPrice?: number;

  @ApiPropertyOptional({
    description: 'Tipo de documento asociado a la compra',
    example: 'Boleta',
  })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'Método de pago utilizado en la transacción',
    example: 'MercadoPago',
  })
  @IsOptional()
  paymentGateway?: string;

  @ApiPropertyOptional({
    description: 'ID de la transacción en el gateway de pago (si aplica)',
    example: 'pay_1234567890',
    nullable: true,
  })
  @IsOptional()
  paymentGatewayTransactionId?: string;

  @ApiPropertyOptional({
    description: 'Estado del pago (Pending, Paid, Failed)',
    example: 'Pending',
  })
  @IsOptional()
  paymentStatus?: string;

  @ApiPropertyOptional({
    description: 'Fecha de pago del pedido (si aplica)',
    example: '2025-11-06T23:00:00.000Z',
    nullable: true,
  })
  @IsOptional()
  paymentDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de compra registrada',
    example: '2025-11-06T22:10:00.000Z',
  })
  @IsOptional()
  purchaseDate?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario asociado al pedido',
    example: 'd8fcb6ee-3799-4d5a-badb-0a5c84b34109',
  })
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description:
      'Límite de resultados por página, si es 0 trae todos los resultados',
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Desplazamiento de resultados, si limit es 0, no se aplica',
  })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ description: 'Campos a seleccionar' })
  @IsOptional()
  selectFields?: string;

  @ApiPropertyOptional({ description: 'IDs de usuarios separados por comas' })
  @IsOptional()
  idsSeparatedByComma?: string;
}
