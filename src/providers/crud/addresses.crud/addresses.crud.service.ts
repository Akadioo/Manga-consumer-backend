import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateAddressDto } from 'src/api/addresses/dto/create-address.dto';
import { ReadAddressDto } from 'src/api/addresses/dto/read-addresses.dto';
import { Address } from 'src/api/addresses/entities/address.entity';
import { PaginatedResponse } from '../utils/paginated.response.dto';
import { UpdateAddressDto } from 'src/api/addresses/dto/update-addresses.dto';

@Injectable()
export class AddressesCrudService {
  private readonly logger = new Logger(AddressesCrudService.name);
  private readonly crudUrl: string;
  private readonly crudToken: string;
  private readonly requestTimeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.crudUrl = this.configService.get<string>('CRUD_URL')!;
    this.crudToken = this.configService.get<string>('APP_TOKEN_CRUD')!;
    this.requestTimeout =
      Number(this.configService.get<number>('REQUEST_TIMEOUT_MS')) || 5000;
  }

  private get headers() {
    return { Authorization: `Bearer ${this.crudToken}` };
  }

  async create(dto: CreateAddressDto): Promise<Address> {
    this.logger.debug('Enviando solicitud de creación de dirección al CRUD');
    const { data } = await this.httpService.axiosRef.post<Address>(
      `${this.crudUrl}/api/addresses`,
      dto,
      { headers: this.headers, timeout: this.requestTimeout },
    );
    return data;
  }

  async findByParams(dto: ReadAddressDto): Promise<PaginatedResponse<Address>> {
    this.logger.debug('Solicitando direcciones al CRUD');
    const { data } = await this.httpService.axiosRef.get<
      PaginatedResponse<Address>
    >(`${this.crudUrl}/api/addresses`, {
      params: dto,
      headers: this.headers,
      timeout: this.requestTimeout,
    });
    return data;
  }

  async findById(id: string): Promise<Address> {
    this.logger.debug(`Buscando dirección con id ${id}`);
    const { data } = await this.httpService.axiosRef.get<Address>(
      `${this.crudUrl}/api/addresses/${id}`,
      { headers: this.headers, timeout: this.requestTimeout },
    );
    return data;
  }

  async updateById(id: string, dto: UpdateAddressDto): Promise<Address> {
    this.logger.debug(`Actualizando dirección con id ${id}`);
    const { data } = await this.httpService.axiosRef.patch<Address>(
      `${this.crudUrl}/api/addresses/${id}`,
      dto,
      { headers: this.headers, timeout: this.requestTimeout },
    );
    return data;
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.debug(`Eliminando dirección con id ${id}`);
    const { data } = await this.httpService.axiosRef.delete<{
      message: string;
    }>(`${this.crudUrl}/api/addresses/${id}`, {
      headers: this.headers,
      timeout: this.requestTimeout,
    });
    return data;
  }
}
