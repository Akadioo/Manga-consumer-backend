import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { IsOptional, IsString, IsNotEmpty, IsArray } from 'class-validator';
import { CreateMangaDto } from './create-manga.dto';

export class ReadMangaDto extends PartialType(CreateMangaDto) {
  @ApiPropertyOptional({ description: 'Nombre del manga' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Nombre del autor' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    type: 'array',
    description: 'Lista de géneros del manga',
    example: ['fantasía', 'acción', 'comedia'],
    isArray: true,
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genre?: string[];

  @ApiPropertyOptional({ description: 'ISSN' })
  @IsOptional()
  @IsString()
  issn?: string;

  @ApiPropertyOptional({
    description:
      'Límite de resultados por página, si es 0 trae todos los resultados',
  })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Desplazamiento de resultados, si limit es 0, no se aplica',
  })
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ description: 'Campos a seleccionar' })
  @IsOptional()
  selectFields?: string;

  @ApiPropertyOptional({ description: 'IDs de usuarios separados por comas' })
  @IsOptional()
  idsSeparatedByComma?: string;
}
