import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/utils/decorators/public.decorator';
import { UsersService } from 'src/api/users/users.service';

@Injectable()
export class SessionTokenGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.ENVIRONMENT !== 'production') return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const token =
      request.headers['x-user-session'] ||
      request.headers['X-User-Session'] ||
      request.headers['authorization']?.replace('Bearer ', '') ||
      null;

    if (!token) {
      throw new UnauthorizedException('Token de sesión no proporcionado');
    }

    const user = await this.usersService.findUserBySessionToken(token);

    if (!user || !user.id) {
      throw new UnauthorizedException('Token inválido o sesión expirada');
    }

    request.user = {
      ...user,
      role: user.type,
    };

    return true;
  }
}
