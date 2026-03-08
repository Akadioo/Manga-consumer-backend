import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTomeDto {
  @ApiProperty({
    type: 'string',
    description: ' Volumen del tomo',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  volumen?: number;

  @ApiProperty({
    type: 'string',
    description: ' ISBN del tomo',
    required: true,
  })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiProperty({
    type: 'string',
    description: 'Formato del tomo (ej: Tankobon, B6, 2 en 1, Kanzenban)',
    required: true,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    type: 'string',
    description: ' EAN del tomo',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  ean?: string;

  @ApiProperty({
    type: 'number',
    description: ' Precio del tomo',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    type: 'number',
    description: ' Stock del tomo',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    type: 'string',
    description: ' URL de la imagen del tomo',
    required: true,
  })
  @IsNotEmpty()
  @IsOptional()
  image_tomo_url?: string;

  @ApiProperty({
    type: 'string',
    description: ' ID de la serie a la que pertenece el tomo',
    required: true,
  })
  @IsNotEmpty()
  @IsOptional()
  book_series_id?: string;
}
