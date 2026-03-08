import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  ForbiddenException,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { Public } from 'src/utils/decorators/public.decorator';
import { SessionTokenGuard } from 'src/security/session-token.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';

@UseGuards(SessionTokenGuard, RolesGuard)
@ApiTags('[API] Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    this.logger.log(`Registro nuevo usuario: ${dto.email}`);
    return this.usersService.create(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    this.logger.log(`Intento de login: ${dto.email}`);
    return this.usersService.login(dto);
  }

  @Public()
  @Post('recovery')
  recoveryPassword(@Body('email') email: string) {
    return this.usersService.recoveryPassword(email);
  }

  @Roles('ADMIN')
  @Get()
  findAll(@Query() query?: ReadUserDto): Promise<User[]> {
    return this.usersService.findUsersByParams(query);
  }

  @Roles('ADMIN')
  @Patch('newToken/:email')
  updateToken(@Param('email') email: string) {
    return this.usersService.updateAuthToken(email);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Roles('ADMIN')
  @Get('verification/:id')
  findVerificationTokenUserId(@Param('id') id: string): Promise<User> {
    return this.usersService.findVerificationTokenUserId(id);
  }

  @Get('fields')
  async getFields(@Req() req, @Query('fields') fields?: string) {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '').trim()
      : authHeader.trim();

    if (!token) throw new UnauthorizedException('Falta token de sesión');

    const list = fields
      ? fields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
      : undefined;

    return this.usersService.getUserFieldsBySessionToken(token, list);
  }

  @Patch('changePassword')
  changePassword(@Req() req, @Body() body: ChangePasswordDto) {
    if (req.user.email !== body.email && req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'No puedes cambiar la contraseña de otro usuario',
      );
    }

    return this.usersService.changePassword(body);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string): Promise<User> {
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      throw new ForbiddenException('No puedes ver datos de otro usuario');
    }

    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      throw new ForbiddenException('No puedes actualizar otro usuario');
    }

    return this.usersService.update(id, dto);
  }
}
