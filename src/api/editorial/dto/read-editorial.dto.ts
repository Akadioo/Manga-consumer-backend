import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { CreateEditorialDto } from './create-editorial.dto';

export class ReadEditorialDto extends PartialType(CreateEditorialDto) {
  @ApiPropertyOptional({ description: 'Nombre de la editorial' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name?: string;

  @ApiPropertyOptional({ description: 'Sitio web de la editorial' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El sitio web no puede estar vacío' })
  website?: string;

  @ApiPropertyOptional({ description: 'País de la editorial' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  country?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono de contacto' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Correo de contacto' })
  @IsOptional()
  @IsString()
  contact_email?: string;

  @ApiPropertyOptional({
    description: 'Límite de resultados por página (0 = todos los resultados)',
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Desplazamiento de resultados (offset)',
  })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({
    description: 'Campos específicos a seleccionar, separados por comas',
  })
  @IsOptional()
  selectFields?: string;

  @ApiPropertyOptional({
    description: 'IDs de editoriales separados por comas',
  })
  @IsOptional()
  idsSeparatedByComma?: string;
}
