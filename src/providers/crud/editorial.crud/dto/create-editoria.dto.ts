import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUUID,
} from 'class-validator';

export class CreateEditorialDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'Identificador único de la editorial',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    type: 'string',
    description: 'Nombre de la editorial',
    required: true,
    example: 'Shueisha',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Sitio web de la editorial',
    required: false,
    example: 'https://www.shueisha.co.jp/',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    type: 'string',
    description: 'País de origen de la editorial',
    required: false,
    example: 'Japón',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    type: 'string',
    description: 'Número telefónico de contacto de la editorial',
    required: false,
    example: '+81 3-3230-6000',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    type: 'string',
    description: 'Correo electrónico de contacto de la editorial',
    required: false,
    example: 'contact@shueisha.co.jp',
  })
  @IsOptional()
  @IsEmail()
  contact_email?: string;
}
