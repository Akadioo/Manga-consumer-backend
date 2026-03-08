import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginatedResponse } from '../utils/paginated.response.dto';
import { CreateMangaDto } from 'src/api/manga/dto/create-manga.dto';
import { UpdateMangaDto } from 'src/api/manga/dto/update-manga.dto';
import { ReadMangaDto } from 'src/api/manga/dto/read-manga.dto';
import { Manga } from 'src/api/manga/entities/manga.entity';

@Injectable()
export class MangasCrudService {
  private readonly logger = new Logger(MangasCrudService.name);
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
      'Content-Type': 'application/json',
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

  async create(createMangaDto: CreateMangaDto): Promise<Manga> {
    try {
      this.log('Enviando solicitud de creación de manga al CRUD', 'debug');

      const payload = JSON.parse(JSON.stringify(createMangaDto));

      const { data } = await this.httpService.axiosRef.post<Manga>(
        `${this.crudUrl}/api/mangas`,
        payload,
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );

      this.log('Manga creado en el CRUD');
      return data;
    } catch (error: any) {
      const safeMsg = error?.message || 'Error desconocido';
      this.log(`Error creando manga en CRUD: ${safeMsg}`, 'error');
      throw error;
    }
  }

  async findMangasByParams(readMangaDto: ReadMangaDto): Promise<Manga[]> {
    try {
      this.log('Solicitando mangas al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.get<
        PaginatedResponse<Manga>
      >(`${this.crudUrl}/api/mangas`, {
        params: readMangaDto,
        headers: this.headers,
        timeout: this.requestTimeout,
      });
      this.log('Mangas recibidos desde el CRUD');
      return data.data;
    } catch (error: any) {
      this.log(
        `Error obteniendo mangas desde CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }

  async findMangaById(id: string): Promise<Manga> {
    try {
      this.log(`Buscando manga con id ${id} en el CRUD`, 'debug');
      const { data } = await this.httpService.axiosRef.get<Manga>(
        `${this.crudUrl}/api/mangas/${id}`,
        { headers: this.headers, timeout: this.requestTimeout },
      );
      this.log('Manga encontrado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(`Error obteniendo manga desde CRUD: ${error.message}`, 'error');
      throw error;
    }
  }

  async removeMangaById(id: string): Promise<{ affected: number }> {
    try {
      this.log('Enviando solicitud de eliminación de manga al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.delete<{
        affected: number;
      }>(`${this.crudUrl}/api/mangas/${id}`, {
        headers: this.headers,
        timeout: this.requestTimeout,
      });
      this.log('Manga eliminado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(`Error eliminando manga en CRUD: ${error.message}`, 'error');
      throw error;
    }
  }

  async updateMangaById(
    id: string,
    updateMangaDto: UpdateMangaDto,
  ): Promise<Manga> {
    try {
      this.log(
        'Enviando solicitud de actualización de manga al CRUD',
        'debug',
      );

      const payload = JSON.parse(JSON.stringify(updateMangaDto));

      const { data } = await this.httpService.axiosRef.patch<Manga>(
        `${this.crudUrl}/api/mangas/${id}`,
        payload,
        { headers: this.headers, timeout: this.requestTimeout },
      );

      this.log('Manga actualizado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(`Error actualizando manga en CRUD: ${error.message}`, 'error');
      throw error;
    }
  }
}
