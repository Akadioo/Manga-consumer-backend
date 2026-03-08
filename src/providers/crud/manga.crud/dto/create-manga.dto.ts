import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateMangaDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Identificador único del manga',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    type: 'string',
    description: 'Nombre del manga',
    required: true,
    example: 'One Piece',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Autor del manga',
    required: true,
    example: 'Eiichiro Oda',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    type: 'string',
    description: 'Género del manga',
    required: false,
    example: 'Aventura',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({
    type: 'string',
    description: 'URL de la imagen del manga',
    required: false,
    example: 'https://example.com/onepiece.jpg',
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({
    type: 'string',
    description: 'Código ISSN del manga',
    required: false,
    example: '1234-5678',
  })
  @IsOptional()
  @IsString()
  issn?: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Identificador de la editorial asociada',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  editorial_id: string;
}
