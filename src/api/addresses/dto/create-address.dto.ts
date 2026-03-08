import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { COUNTRIES_ARRAY } from '../enums/countries.enum';
import { RegionEnum } from '../enums/regions.enum';
import { CommuneEnum } from '../enums/communes.enum';

export class CreateAddressDto {
  @ApiProperty({ default: 'Chile', description: 'País del domicilio' })
  @IsOptional()
  @IsString({ message: 'El país debe ser texto' })
  @IsEnum(COUNTRIES_ARRAY, { message: 'El país no es válido' })
  country?: string;

  @ApiProperty({ example: 'Región Metropolitana' })
  @IsString({ message: 'La región debe ser texto' })
  @IsEnum(RegionEnum, { message: 'La región  no es válido' })
  region: string;

  @ApiProperty({ example: 'Santiago' })
  @IsString({ message: 'La provincia debe ser texto' })
  @IsEnum(CommuneEnum, { message: 'Distrito no válido' })
  province: string;

  @ApiProperty({ example: 'Providencia' })
  @IsString({ message: 'El distrito debe ser texto' })
  district: string;

  @ApiProperty({ example: 'Calle Falsa' })
  @IsString({ message: 'La calle debe ser texto' })
  street: string;

  @ApiProperty({ example: '1234ABCD' })
  @IsString({ message: 'El número debe ser texto' })
  number: string;

  @ApiProperty({
    required: false,
    example: 'Departamento 56, cerca del parque',
  })
  @IsOptional()
  @IsString({ message: 'La información adicional debe ser texto' })
  aditional_information?: string;

  @ApiProperty({
    description: 'UUID del usuario asociado a la dirección',
    example: '8fe194bb-8ef8-4f13-877a-973ff97d8a41',
  })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  userId: string;
}
