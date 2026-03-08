import { CreateMangaDto } from './create-manga.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateMangaDto extends PartialType(CreateMangaDto) {
  @ApiPropertyOptional({ description: 'Nombre del manga' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Autor del manga' })
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

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Imagen del manga (opcional)',
  })
  image?: any;
}
