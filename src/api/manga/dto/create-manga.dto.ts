import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateMangaDto {
  @ApiProperty({
    type: 'string',
    description: 'Nombre del manga',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Nombre del autor',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    type: 'array',
    description: 'Lista de géneros del manga',
    example: ['fantasía', 'acción', 'comedia'],
    isArray: true,
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  genre: string[];

  @ApiProperty({
    type: 'string',
    description: 'imagen del manga',
    required: true,
  })
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    type: 'string',
    description: 'ingrese issn',
    required: true,
  })
  @IsString()
  @IsOptional()
  issn?: string;

  @ApiProperty({
    description: 'ID de la editorial asociada',
    example: '66f5a896-2a39-4985-b92c-adcc45ba8e64',
  })
  @IsNotEmpty()
  @IsUUID()
  editorialId: string;
}
