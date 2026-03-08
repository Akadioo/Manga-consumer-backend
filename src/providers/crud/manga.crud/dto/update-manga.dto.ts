import { CreateMangaDto } from 'src/api/manga/dto/create-manga.dto';
import { IsOptional, IsString, IsUUID, IsArray } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class UpdateMangaDto extends PartialType(CreateMangaDto) {
  @ApiPropertyOptional({ description: 'Nombre del manga' })
  @IsOptional()
  @IsString()
  name?: string;

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
  genre: string[];

  @ApiPropertyOptional({ description: 'URL de la imagen del manga' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiPropertyOptional({ description: 'Código ISSN del manga' })
  @IsOptional()
  @IsString()
  issn?: string;

  @ApiPropertyOptional({
    description: 'Identificador de la editorial asociada (UUID)',
  })
  @IsOptional()
  @IsUUID()
  editorial_id?: string;
}
