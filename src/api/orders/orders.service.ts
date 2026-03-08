import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ReadOrderDto } from './dto/read-order.dto';
import { Order } from './entities/order.entity';
import { PaginatedResponse } from 'src/providers/crud/utils/paginated.response.dto';
import { OrdersCrudService } from 'src/providers/crud/orders.crud/orders.crud.service';
import { SessionTokenGuard } from 'src/security/session-token.guard';
import { RolesGuard } from 'src/security/roles.guard';

export interface MercadoPagoSyncPayload {
  orderId: string;
  status: string; // approved | pending | rejected | cancelled
  paymentStatus?: string;
  paymentDate?: string | Date | null;
  paymentGatewayTransactionId?: string | null;
  payerEmail?: string | null;
  paymentData?: any;
}

@UseGuards(SessionTokenGuard, RolesGuard)
@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly ordersCrudService: OrdersCrudService) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    this.logger.debug('Enviando orden al CRUD...');
    const order = await this.ordersCrudService.create(dto);
    this.logger.log(`Orden creada en CRUD con ID: ${order.id}`);
    return order;
  }

  async findByParams(params: ReadOrderDto): Promise<PaginatedResponse<Order>> {
    this.logger.debug('Consultando órdenes en CRUD...');
    return await this.ordersCrudService.findByParams(params);
  }

  async findOne(id: string): Promise<Order> {
    this.logger.debug(`Buscando orden con ID: ${id} en CRUD...`);
    return await this.ordersCrudService.findOne(id);
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    this.logger.debug(`Actualizando orden con ID: ${id}`);
    return await this.ordersCrudService.update(id, dto);
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.debug(`Eliminando orden con ID: ${id}`);
    return await this.ordersCrudService.remove(id);
  }

  async syncMercadoPagoPayment(payload: MercadoPagoSyncPayload) {
    const {
      orderId,
      status,
      paymentStatus,
      paymentDate,
      paymentGatewayTransactionId,
      payerEmail,
      paymentData,
    } = payload;

    this.logger.log(
      `Sincronizando orden ${orderId} con estado de Mercado Pago: ${status}`,
    );

    const normalizedStatus = status?.toUpperCase() ?? 'PENDING';

    const normalizedPaymentStatus =
      paymentStatus ??
      (status === 'approved'
        ? 'Paid'
        : status === 'pending'
          ? 'Pending'
          : 'Failed');

    const normalizedPaymentDate =
      typeof paymentDate === 'string'
        ? new Date(paymentDate)
        : (paymentDate ?? null);

    return await this.ordersCrudService.update(orderId, {
      status: normalizedStatus,
      paymentStatus: normalizedPaymentStatus,
      paymentDate: normalizedPaymentDate,
      paymentGatewayTransactionId: paymentGatewayTransactionId ?? undefined,
      payerEmail: payerEmail ?? null,
      paymentData,
    });
  }

  async applyStockUpdateFromPayment(orderId: string) {
    this.logger.log(
      `Aplicando descuento de stock en CRUD para orden ${orderId}`,
    );
    return await this.ordersCrudService.applyStockUpdateFromPayment(orderId);
  }
}
