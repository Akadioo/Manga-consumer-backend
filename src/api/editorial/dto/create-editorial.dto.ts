import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateEditorialDto {
  @ApiProperty({ description: 'Nombre de la editorial' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'Sitio web de la editorial' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false, description: 'País de la editorial' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ required: false, description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, description: 'Email de contacto' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;
}
