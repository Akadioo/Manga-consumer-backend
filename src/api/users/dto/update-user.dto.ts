import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono del usuario' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Correo del usuario' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Hash de la contraseña del usuario' })
  @IsOptional()
  @IsString()
  passwordHash?: string;

  @ApiPropertyOptional({ description: 'Hash de la contraseña del usuario' })
  @IsOptional()
  @IsString()
  verificationToken?: string;
}
