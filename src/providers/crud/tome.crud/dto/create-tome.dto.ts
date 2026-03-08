import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTomeDto {
  @ApiProperty({
    type: 'string',
    description: ' Volumen del tomo',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  volumen: number;

  @ApiProperty({
    type: 'string',
    description: ' ISBN del tomo',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ApiProperty({
    type: 'string',
    description: 'Formato del tomo (ej: Tankobon, B6, 2 en 1, Kanzenban)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

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
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: 'number',
    description: ' Stock del tomo',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    type: 'string',
    description: ' URL de la imagen del tomo',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  image_tomo_url: string;

  @ApiProperty({
    type: 'string',
    description: ' ID de la serie a la que pertenece el tomo',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  book_series_id: string;
}
