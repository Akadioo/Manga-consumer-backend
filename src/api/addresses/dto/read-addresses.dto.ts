import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class ReadAddressDto {
  @ApiPropertyOptional({
    description: 'ID único de la dirección',
    example: '33f2abc5-a10a-4dc2-9ee9-4e2f9474b94f',
  })
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @ApiPropertyOptional({
    description: 'País de la dirección (por defecto Chile)',
    example: 'Chile',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Región de la dirección',
    example: 'Metropolitana',
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Provincia de la dirección',
    example: 'Santiago',
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({
    description: 'Comuna o distrito del domicilio',
    example: 'La Florida',
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    description: 'Nombre de la calle del domicilio',
    example: 'Avenida Los Jardines',
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({
    description: 'Número de casa o departamento',
    example: '1313',
  })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional({
    description: 'Información adicional (bloque, referencia, etc.)',
    example: 'Casa amarilla con portón negro',
  })
  @IsOptional()
  @IsString()
  aditional_information?: string;

  @ApiPropertyOptional({
    description: 'UUID del usuario asociado a esta dirección',
    example: '8fe194bb-8ef8-4f13-877a-973ff97d8a41',
  })
  @IsOptional()
  @IsUUID('4')
  userId?: string;

  @ApiPropertyOptional({
    description:
      'Límite de resultados por página, si es 0 trae todos los registros',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Desplazamiento de resultados (offset)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({
    description: 'Campos a seleccionar (separados por comas)',
    example: 'id,region,district,street',
  })
  @IsOptional()
  @IsString()
  selectFields?: string;

  @ApiPropertyOptional({
    description: 'IDs separados por comas para filtrar varias direcciones',
    example:
      '33f2abc5-a10a-4dc2-9ee9-4e2f9474b94f,1d75b230-112b-42a4-9c22-993cabc1234f',
  })
  @IsOptional()
  @IsString()
  idsSeparatedByComma?: string;
}
