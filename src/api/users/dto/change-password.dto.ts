import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsUUID()
  id: string;

  @IsString()
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres',
  })
  newPassword: string;

  @IsString()
  @MinLength(8)
  currentPassword?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
