import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginatedResponse } from '../utils/paginated.response.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/api/users/entities/user.entity';

@Injectable()
export class UsersCrudService {
  private readonly logger = new Logger(UsersCrudService.name);
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


  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.log('Enviando solicitud de creación de usuario al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.post<User>(
        `${this.crudUrl}/api/users`,
        createUserDto,
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );
      this.log('Usuario creado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(`Error creando usuario en CRUD: ${error.message}`, 'error');
      throw error;
    }
  }

  async findUsersByParams(readUserDto: ReadUserDto): Promise<User[]> {
    try {
      this.log('Solicitando usuarios al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.get<
        PaginatedResponse<User>
      >(`${this.crudUrl}/api/users`, {
        params: readUserDto,
        headers: this.headers,
        timeout: this.requestTimeout,
      });
      this.log('Usuarios recibidos desde el CRUD');
      return data.data;
    } catch (error: any) {
      this.log(
        `Error obteniendo usuarios desde CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      this.log(`Buscando usuario con id ${id} en el CRUD`, 'debug');
      const { data } = await this.httpService.axiosRef.get<User>(
        `${this.crudUrl}/api/users/${id}`,
        { headers: this.headers, timeout: this.requestTimeout },
      );
      this.log('Usuario encontrado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(
        `Error obteniendo usuario desde CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }

  async removeUserById(id: string): Promise<{ message: string }> {
    try {
      this.log(`Enviando solicitud de eliminación al CRUD`, 'debug');

      const { data } = await this.httpService.axiosRef.delete<{
        message: string;
      }>(`${this.crudUrl}/api/users/${id}`, {
        headers: this.headers,
        timeout: this.requestTimeout,
      });

      this.log(`Usuario eliminado correctamente en el CRUD`);
      return data;
    } catch (error: any) {
      this.log(
        `Error eliminando usuario en CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }

  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      this.log('Enviando solicitud de actualización al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.patch<User>(
        `${this.crudUrl}/api/users/${id}`,
        updateUserDto,
        { headers: this.headers, timeout: this.requestTimeout },
      );
      this.log('Usuario actualizado en el CRUD');
      return data;
    } catch (error: any) {
      this.log(
        `Error actualizando usuario en CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }


  async login(dto: { email: string; password: string }) {
    try {
      this.log('Enviando login al CRUD', 'debug');
      const { data } = await this.httpService.axiosRef.post(
        `${this.crudUrl}/api/users/login`,
        dto,
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );
      this.log('Login exitoso en el CRUD');
      return data; // { token, user }
    } catch (error: any) {
      this.log(`Error en login del CRUD: ${error.message}`, 'error');
      throw error;
    }
  }


  async getUserFields(params: { userAuthToken: string; fields?: string }) {
    try {
      const { userAuthToken, fields } = params;

      this.log(
        `[CRUD] getUserFields llamado con token: ${userAuthToken}`,
        'debug',
      );

      const url = new URL(`${this.crudUrl}/api/users/fields`);
      url.searchParams.set('userAuthToken', userAuthToken);
      if (fields) url.searchParams.set('fields', fields);

      this.log(`[CRUD] Llamando a URL: ${url.toString()}`, 'debug');

      const { data } = await this.httpService.axiosRef.get<User>(
        url.toString(),
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );

      this.log(`[CRUD] Usuario obtenido: ${JSON.stringify(data)}`, 'debug');
      return data;
    } catch (error: any) {
      this.log(`[CRUD] Error obteniendo usuario: ${error.message}`, 'error');
      throw error;
    }
  }

  async recoveryUserByEmail(email: string): Promise<{ message: string }> {
    try {
      const { data } = await this.httpService.axiosRef.post(
        `${this.crudUrl}/api/users/recovery`,
        { email },
        {
          headers: this.headers,
          timeout: this.requestTimeout,
        },
      );
      return data;
    } catch (error: any) {
      this.log(
        `Error solicitando recuperación al CRUD: ${error.message}`,
        'error',
      );
      throw error;
    }
  }
}
