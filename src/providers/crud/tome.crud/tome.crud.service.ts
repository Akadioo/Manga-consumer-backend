import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Tome } from 'src/api/tome/entities/tome.entity';
import { PaginatedResponse } from '../utils/paginated.response.dto';
import { CreateTomeDto } from './dto/create-tome.dto';
import { ReadTomeDto } from './dto/read-tome.dto';

@Injectable()
export class TomeCrudService {
  private readonly logger = new Logger(TomeCrudService.name);
  private readonly crudUrl: string;
  private readonly crudToken: string;
  private readonly requestTimeout: number;
  private readonly logLevel: string;

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

    this.logLevel = this.configService.get<string>('LOG_LEVEL') || 'debug';
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.crudToken}`,
    };
  }

  private log(
    message: string,
    level: 'debug' | 'log' | 'warn' | 'error' = 'log',
  ) {
    if (this.logLevel === 'debug' || level !== 'debug') {
      this.logger[level](message);
    }
  }

  async create(createTomeDto: CreateTomeDto): Promise<Tome> {
    try {
      this.log('Enviando solicitud de creación de tomo al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.post<Tome>(
        `${this.crudUrl}/api/tomes`,
        createTomeDto,
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );
      this.log('Tomo creado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(`Error creando tomo en CRUD: ${error.message}`, 'error');
      throw error;
    }
  }

  async findTomeByParams(readTomeDto: ReadTomeDto): Promise<Tome[]> {
    try {
      this.log('Enviando solicitud de búsqueda de tomos al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.get<
        PaginatedResponse<Tome>
      >(`${this.crudUrl}/api/tomes`, {
        params: readTomeDto,
        headers: this.headers,
        timeout: this.requestTimeout,
      });
      this.log('Tomos obtenidos del CRUD');
      return data.data;
    } catch (error: any) {
      this.log(`Error obteniendo tomos del CRUD: ${error.message}`, 'error');
      throw error;
    }
  }

  async findTomeById(id: string): Promise<Tome> {
    try {
      this.log(
        'Enviando solicitud de búsqueda de tomo por ID al CRUD',
        'debug',
      );
      const { data } = await this.httpService.axiosRef.get<Tome>(
        `${this.crudUrl}/api/tomes/${id}`,
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );
      this.log('Tomo obtenido del CRUD');
      return data;
    } catch (error: any) {
      this.log(`Error obteniendo tomo del CRUD: ${error.message}`, 'error');
      throw error;
    }
  }

  async removeMangaById(id: string): Promise<{ affected: number }> {
    try {
      this.log('Enviando solicitud de eliminación de tomo al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.delete<{
        affected: number;
      }>(`${this.crudUrl}/api/tomes/${id}`, {
        headers: this.headers,
        timeout: this.requestTimeout,
      });
      this.log('Tomo eliminado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(`Error eliminando tomo en CRUD: ${error.message}`, 'error');
      throw error;
    }
  }

  async updateTomeById(
    id: string,
    updateTomeDto: Partial<CreateTomeDto>,
  ): Promise<Tome> {
    try {
      this.log(
        'Enviando solicitud de actualización de tomo al CRUD',
        'debug',
      );
      const payload = JSON.parse(JSON.stringify(updateTomeDto));
      const { data } = await this.httpService.axiosRef.patch<Tome>(
        `${this.crudUrl}/api/tomes/${id}`,
        payload,
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );
      this.log('Tomo actualizado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(`Error actualizando tomo en CRUD: ${error.message}`, 'error');
      throw error;
    }
  }
}
