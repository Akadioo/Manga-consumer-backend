import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersCrudService } from 'src/providers/crud/users.crud/users.crud.service';
import { User } from './entities/user.entity';

import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { ReadUserDto } from 'src/providers/crud/users.crud/dto/read-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private userCrudService: UsersCrudService) {}


  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        createUserDto.passwordHash,
        salt,
      );

      const payload = {
        name: createUserDto.name,
        surname: createUserDto.surname,
        email: createUserDto.email,
        phone: createUserDto.phone,
        passwordHash: hashedPassword,
      };

      const resp = await this.userCrudService.create(payload);
      this.logger.log(`Usuario creado exitosamente: ${resp.id}`);
      return resp;
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already exists')) {
        this.logger.warn('Intento de crear usuario duplicado');
      } else {
        this.logger.error(
          `Error creando usuario en Consumer: ${JSON.stringify(error)}`,
        );
      }

      throw new InternalServerErrorException('Error creando el usuario');
    }
  }

  async findUsersByParams(readUserDto?: ReadUserDto): Promise<User[]> {
    try {
      const params = {
        ...readUserDto,
        limit: readUserDto?.limit ?? 0,
      };
      const usersResponse =
        await this.userCrudService.findUsersByParams(params);
      return usersResponse;
    } catch {
      throw new InternalServerErrorException(
        'Local error fetching users by params',
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const response = await this.userCrudService.findUserById(id);

      if (!response)
        throw new NotFoundException(`User with ID ${id} not found`);
      return response;
    } catch (error) {
      if (error.response?.status === 404)
        throw new NotFoundException(`User with ID ${id} not found`);
      throw new InternalServerErrorException('Local error fetching user by id');
    }
  }

  async findVerificationTokenUserId(id: string): Promise<User> {
    try {
      const userResponse = await this.userCrudService.findUserById(id);
      if (userResponse) {
        const { email, verified, verificationToken } = userResponse;
        return { email, verified, verificationToken } as User;
      } else {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch {
      throw new InternalServerErrorException('Local error fetching user by id');
    }
  }

  async verificate(verificationToken: string): Promise<{ message: string }> {
    try {
      const usersResponse = await this.userCrudService.findUsersByParams({
        verificationToken,
      });

      if (!usersResponse[0]) {
        throw new NotFoundException(
          `User with verification token ${verificationToken} not found`,
        );
      }

      if (usersResponse[0]?.verified)
        return { message: 'User already verified' };

      await this.userCrudService.updateUserById(usersResponse[0].id, {
        verified: true,
      });

      return { message: 'User verified successfully' };
    } catch {
      throw new InternalServerErrorException('Local error verifying user');
    }
  }


  async changePassword(body: ChangePasswordDto): Promise<{ message: string }> {
    try {
      const { id, newPassword, currentPassword } = body;
      const user = await this.userCrudService.findUserById(id);
      if (!user) throw new NotFoundException('Usuario no encontrado.');

      if (currentPassword) {
        const matches = await bcrypt.compare(
          currentPassword,
          user.passwordHash,
        );
        if (!matches)
          throw new BadRequestException('La contraseña actual es incorrecta.');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const newVerificationToken = randomUUID();

      await this.userCrudService.updateUserById(id, {
        passwordHash: hashedPassword,
        verificationToken: newVerificationToken,
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException('Local error changing password');
    }
  }


  async recoveryUserByVerificationToken(verificationToken: string): Promise<{
    message: string;
    id: string;
    verified: boolean;
    authToken: string;
  }> {
    try {
      const [userResponse] = await this.userCrudService.findUsersByParams({
        verificationToken,
      });

      if (!userResponse)
        throw new NotFoundException('Invalid verification token');

      return {
        message: 'User qualified for recovery',
        id: userResponse.id,
        verified: userResponse.verified,
        authToken: userResponse.userAuthToken ?? '',
      };
    } catch {
      throw new InternalServerErrorException('Error consulting the API');
    }
  }


  async findUserBySessionToken(
    sessionAuthToken: string,
  ): Promise<Partial<User>> {
    try {
      const [userResponse] = await this.userCrudService.findUsersByParams({
        userAuthToken: sessionAuthToken,
        selectFields: 'id,email,type,name,surname',
      });

      if (!userResponse) return {} as Partial<User>;
      return userResponse as Partial<User>;
    } catch (error) {
      console.error('Error en findUserBySessionToken:', error);
      return {} as Partial<User>;
    }
  }

  async getUserFieldsBySessionToken(
    sessionAuthToken: string,
    optionalFields?: string[],
  ): Promise<User> {
    try {
      this.logger.log(`Consultando usuario por token (Consumer → CRUD)`);

      const userResponse = await this.userCrudService.getUserFields({
        userAuthToken: sessionAuthToken,
        fields: optionalFields ? optionalFields.join(',') : undefined,
      });

      if (!userResponse) throw new NotFoundException('User not found');

      this.logger.log(`Usuario recibido: ${userResponse.email}`);
      return userResponse;
    } catch (e) {
      this.logger.error(
        `Error en getUserFieldsBySessionToken: ${e.message}`,
      );
      throw new InternalServerErrorException('Error consulting API');
    }
  }

  async findUserIdBySessionToken(
    sessionAuthToken: string,
  ): Promise<string | null> {
    try {
      const [userResponse] = await this.userCrudService.findUsersByParams({
        userAuthToken: sessionAuthToken,
        selectFields: 'id',
      });

      if (!userResponse) {
        this.logger.warn(
          `No se encontró usuario con token de sesión: ${sessionAuthToken}`,
        );
        return null;
      }
      this.logger.log(`Usuario con sesión encontrada: ${userResponse.id}`);
      return userResponse.id;
    } catch {
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    try {
      this.logger.log(`Actualizando usuario con id: ${id}`);
      const updatedUser = await this.userCrudService.updateUserById(
        id,
        updateUserDto,
      );

      if (!updatedUser) throw new NotFoundException('User not found');
      this.logger.log(`Usuario actualizado correctamente: ${id}`);
      return 'User updated';
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Error updating the user');
    }
  }

  async updateAuthToken(email: string): Promise<string> {
    const newAuthToken = randomUUID();
    try {
      const [userToUpdate] = await this.userCrudService.findUsersByParams({
        email,
      });

      if (!userToUpdate?.id) throw new NotFoundException('User not found');

      await this.userCrudService.updateUserById(userToUpdate.id, {
        userAuthToken: newAuthToken,
      });

      return newAuthToken;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Error updating the user');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const response = await this.userCrudService.removeUserById(id);
      return response;
    } catch (e) {
      if (e.response?.status === 404)
        throw new NotFoundException('User not found');
      throw new InternalServerErrorException('Error deleting the user');
    }
  }

  async login(dto: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    try {
      this.logger.log(`Login desde consumer para: ${dto.email}`);
      const response = await this.userCrudService.login(dto);
      this.logger.log(`Login exitoso desde CRUD para: ${dto.email}`);
      return response;
    } catch (error: any) {
      this.logger.error(`Error en login del consumer: ${error.message}`);

      if (error.response?.status === 404)
        throw new NotFoundException('Usuario no encontrado');

      if (error.response?.status === 401 || error.response?.status === 400)
        throw new BadRequestException('Correo o contraseña incorrectos');

      throw new InternalServerErrorException('Error al iniciar sesión');
    }
  }

  findUserById(id: string): Promise<User> {
    this.logger.warn(`Método findUserById no implementado en el Consumer`);
    throw new Error('Method not implemented.');
  }

  findVerficationTokenUserId(id: string): Promise<User> {
    this.logger.warn(
      `Método findVerficationTokenUserId no implementado en el Consumer`,
    );
    throw new Error('Method not implemented.');
  }

  async recoveryPassword(email: string) {
    try {
      const response = await this.userCrudService.recoveryUserByEmail(email);

      this.logger.log(`Recuperación procesada para ${email}`);
      return response;
    } catch (error: any) {
      this.logger.error(
        `Error en recuperación desde Consumer: ${error.message}`,
      );
      throw new BadRequestException(
        error.response?.data?.message ||
          'Error al procesar recuperación de contraseña',
      );
    }
  }
}
