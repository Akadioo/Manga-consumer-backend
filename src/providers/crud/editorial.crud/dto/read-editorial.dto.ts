import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEmail,
} from 'class-validator';
import { CreateEditorialDto } from './create-editoria.dto';

export class ReadEditorialDto extends PartialType(CreateEditorialDto) {
  @ApiPropertyOptional({
    description: 'Identificador único de la editorial (UUID)',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Nombre de la editorial' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name?: string;

  @ApiPropertyOptional({ description: 'Sitio web de la editorial' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'País de la editorial' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono de la editorial' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Correo de contacto de la editorial' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({
    description:
      'Límite de resultados por página, si es 0 trae todos los resultados',
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Desplazamiento de resultados (offset)',
  })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ description: 'Campos a seleccionar (select)' })
  @IsOptional()
  selectFields?: string;

  @ApiPropertyOptional({
    description: 'IDs de editoriales separados por comas',
  })
  @IsOptional()
  idsSeparatedByComma?: string;
}
