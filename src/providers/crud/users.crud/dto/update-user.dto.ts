import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name?: string;

  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  surname?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono del usuario' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El teléfono no puede estar vacío' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Correo del usuario' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  email?: string;

  @ApiPropertyOptional({ description: 'Hash de la contraseña del usuario' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  passwordHash?: string;

  @ApiPropertyOptional({ description: 'Token de verificación del usuario' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El token de verificación no puede estar vacío' })
  verificationToken?: string;

  @ApiPropertyOptional({ description: 'Indica si el usuario está verificado' })
  @IsOptional()
  verified?: boolean;

  @ApiPropertyOptional({ description: 'Token de autenticación del usuario' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El token de autenticación no puede estar vacío' })
  userAuthToken?: string;
}
