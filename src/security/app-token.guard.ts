import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AppTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (process.env.ENVIRONMENT !== 'production') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-user-session'];

    if (!token) {
      throw new UnauthorizedException('Token de sesión no proporcionado');
    }

    const expected = process.env.APP_TOKEN_CRUD;

    if (token !== expected) {
      throw new UnauthorizedException('Token inválido o sesión expirada');
    }

    return true;
  }
}
