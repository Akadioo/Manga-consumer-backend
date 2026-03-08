import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginatedResponse } from '../utils/paginated.response.dto';
import { CreateEditorialDto } from 'src/api/editorial/dto/create-editorial.dto';
import { UpdateEditorialDto } from 'src/api/editorial/dto/update-editorial.dto';
import { ReadEditorialDto } from 'src/api/editorial/dto/read-editorial.dto';
import { Editorial } from 'src/api/editorial/entities/editorial.entity';

@Injectable()
export class EditorialsCrudService {
  private readonly logger = new Logger(EditorialsCrudService.name);
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

  async create(createEditorialDto: CreateEditorialDto): Promise<Editorial> {
    try {
      this.log(' Enviando solicitud de creación de editorial al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.post<Editorial>(
        `${this.crudUrl}/api/editorials`,
        createEditorialDto,
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );
      this.log(' Editorial creada en el CRUD');
      return data;
    } catch (error: any) {
      this.log(` Error creando editorial en CRUD: ${error.message}`, 'error');
      throw error;
    }
  }

  async findEditorialsByParams(
    readEditorialDto: ReadEditorialDto,
  ): Promise<Editorial[]> {
    try {
      this.log(' Solicitando editoriales al CRUD', 'debug');

      const { data } = await this.httpService.axiosRef.get<
        PaginatedResponse<Editorial>
      >(`${this.crudUrl}/api/editorials`, {
        params: readEditorialDto,
        headers: this.headers,
        timeout: this.requestTimeout,
      });

      this.log(' Editoriales recibidas desde el CRUD');
      return data.data;
    } catch (error: any) {
      this.log(
        ` Error obteniendo editoriales desde CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }

  async findEditorialById(id: string): Promise<Editorial> {
    try {
      this.log(` Buscando editorial con id ${id} en el CRUD`, 'debug');
      const { data } = await this.httpService.axiosRef.get<Editorial>(
        `${this.crudUrl}/api/editorials/${id}`,
        { headers: this.headers, timeout: this.requestTimeout },
      );
      this.log(' Editorial encontrada en el CRUD');
      return data;
    } catch (error: any) {
      this.log(
        ` Error obteniendo editorial desde CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }

  async removeEditorialById(id: string): Promise<{ affected: number }> {
    try {
      this.log(
        ' Enviando solicitud de eliminación de editorial al CRUD',
        'debug',
      );
      const { data } = await this.httpService.axiosRef.delete<{
        affected: number;
      }>(`${this.crudUrl}/api/editorials/${id}`, {
        headers: this.headers,
        timeout: this.requestTimeout,
      });
      this.log(' Editorial eliminada en el CRUD');
      return data;
    } catch (error: any) {
      this.log(
        ` Error eliminando editorial en CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }

  async updateEditorialById(
    id: string,
    updateEditorialDto: UpdateEditorialDto,
  ): Promise<Editorial> {
    try {
      this.log(
        ' Enviando solicitud de actualización de editorial al CRUD',
        'debug',
      );
      const { data } = await this.httpService.axiosRef.patch<Editorial>(
        `${this.crudUrl}/api/editorials/${id}`,
        updateEditorialDto,
        { headers: this.headers, timeout: this.requestTimeout },
      );
      this.log(' Editorial actualizada en el CRUD');
      return data;
    } catch (error: any) {
      this.log(
        ` Error actualizando editorial en CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }
}
