import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { CreateMangaDto } from 'src/api/manga/dto/create-manga.dto';

export class ReadMangaDto {
  @ApiPropertyOptional({
    description: 'Identificador único del manga (UUID)',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Nombre del manga' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name?: string;

  @ApiPropertyOptional({ description: 'Autor del manga' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Género del manga',
    required: false,
    example: 'Aventura',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'URL de la imagen del manga' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ description: 'Código ISSN del manga' })
  @IsOptional()
  @IsString()
  issn?: string;

  @ApiPropertyOptional({
    description: 'Identificador de la editorial asociada',
  })
  @IsOptional()
  @IsUUID()
  editorial_id?: string;

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
    description: 'IDs de mangas separados por comas',
  })
  @IsOptional()
  idsSeparatedByComma?: string;
}
