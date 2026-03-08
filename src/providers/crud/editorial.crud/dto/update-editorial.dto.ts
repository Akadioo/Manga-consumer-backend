import { CreateEditorialDto } from 'src/api/editorial/dto/create-editorial.dto';
import { IsOptional, IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class UpdateEditorialDto extends PartialType(CreateEditorialDto) {
  @ApiPropertyOptional({ description: 'Nombre de la editorial' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name?: string;

  @ApiPropertyOptional({ description: 'Sitio web de la editorial' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El sitio web no puede estar vacío' })
  website?: string;

  @ApiPropertyOptional({ description: 'País de la editorial' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  country?: string;

  @ApiPropertyOptional({ description: 'Número telefónico de la editorial' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico de contacto de la editorial',
  })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  contact_email?: string;
}
