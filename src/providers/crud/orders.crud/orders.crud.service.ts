import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PaginatedResponse } from '../utils/paginated.response.dto';
import { CreateOrderDto } from 'src/api/orders/dto/create-order.dto';
import { Order } from 'src/api/orders/entities/order.entity';
import { ReadOrderDto } from 'src/api/orders/dto/read-order.dto';
import { UpdateOrderDto } from 'src/api/orders/dto/update-order.dto';

@Injectable()
export class OrdersCrudService {
  private readonly logger = new Logger(OrdersCrudService.name);
  private readonly crudUrl: string;
  private readonly crudToken: string;
  private readonly requestTimeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('CRUD_URL');
    if (!url) throw new Error('CRUD_URL no está definida en .env');
    this.crudUrl = url;

    const token = this.configService.get<string>('APP_TOKEN_CRUD');
    if (!token) throw new Error('APP_TOKEN_CRUD no está definida en .env');
    this.crudToken = token;

    this.requestTimeout =
      Number(this.configService.get<number>('REQUEST_TIMEOUT_MS')) || 5000;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.crudToken}`,
    };
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const { data } = await this.httpService.axiosRef.post<Order>(
      `${this.crudUrl}/api/orders`,
      dto,
      { headers: this.headers, timeout: this.requestTimeout },
    );
    this.logger.log(`Orden creada en CRUD`);
    return data;
  }

  async findByParams(params: ReadOrderDto): Promise<PaginatedResponse<Order>> {
    const { data } = await this.httpService.axiosRef.get<
      PaginatedResponse<Order>
    >(`${this.crudUrl}/api/orders`, {
      headers: this.headers,
      params,
      timeout: this.requestTimeout,
    });
    return data;
  }

  async findOne(id: string): Promise<Order> {
    const { data } = await this.httpService.axiosRef.get<Order>(
      `${this.crudUrl}/api/orders/${id}`,
      { headers: this.headers, timeout: this.requestTimeout },
    );
    return data;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const { data } = await this.httpService.axiosRef.patch<Order>(
      `${this.crudUrl}/api/orders/${id}`,
      dto,
      { headers: this.headers, timeout: this.requestTimeout },
    );
    return data;
  }

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await this.httpService.axiosRef.delete<{
      message: string;
    }>(`${this.crudUrl}/api/orders/${id}`, {
      headers: this.headers,
      timeout: this.requestTimeout,
    });
    return data;
  }

  async applyStockUpdateFromPayment(orderId: string) {
    const url = `${this.crudUrl}/api/orders/${orderId}/apply-stock`;

    await this.httpService.axiosRef.patch(
      url,
      {},
      {
        headers: this.headers,
        timeout: this.requestTimeout,
      },
    );

    this.logger.log(`Stock aplicado para orden ${orderId} en CRUD`);
  }
}
