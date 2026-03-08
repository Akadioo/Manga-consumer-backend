import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class ReadUserDto extends PartialType(CreateUserDto) {
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

  @ApiPropertyOptional({ description: 'Verificación del usuario' })
  @IsOptional()
  @IsString()
  verified?: string;

  @ApiPropertyOptional({ description: 'Token de autenticación del usuario' })
  @IsOptional()
  @IsString()
  userAuthToken?: string;

  @ApiPropertyOptional({ description: 'Token de verificación del usuario' })
  @IsOptional()
  @IsString()
  verificationToken?: string;

  @ApiPropertyOptional({ description: 'Límite de resultados por página' })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Desplazamiento de resultados' })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ description: 'IDs de usuarios separados por comas' })
  @IsOptional()
  idsSeparatedByComma?: string;
}
