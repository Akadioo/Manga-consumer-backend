import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'Nombre del usuario',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Nombre del usuario',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    example: '+56 9 12345678',
    description: 'Número de teléfono celular chileno (+56 9 XXXXXXXX)',
  })
  @IsString()
  @Matches(/^\+56 ?9 ?[0-9]{8}$/, {
    message: 'El teléfono debe estar en formato +56 9 XXXXXXXX',
  })
  phone: string;

  @ApiProperty({
    type: 'string',
    description: 'Correo del usuario',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Hash de la contraseña del usuario',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;
}
