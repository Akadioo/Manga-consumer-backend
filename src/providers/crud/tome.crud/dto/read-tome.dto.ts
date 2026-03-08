import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ReadTomeDto {
  @ApiPropertyOptional({ description: 'Número de tomo/Volumen del tomo' })
  @IsOptional()
  @IsNumber()
  volumen?: number;

  @ApiPropertyOptional({ description: 'ISBN del tomo' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({
    description: 'Formato del tomo (ej: Tankobon, B6, 2 en 1, Kanzenban)',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'European Article Number del tomo' })
  @IsOptional()
  @IsString()
  ean?: string;

  @ApiPropertyOptional({ description: 'Precio del tomo' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'Cantidad en stock del tomo' })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ description: 'ID de la serie de libros asociada' })
  @IsOptional()
  @IsUUID()
  book_series_id?: string;

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
