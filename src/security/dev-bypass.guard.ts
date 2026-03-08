import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class DevBypassGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const isDev = process.env.ENVIRONMENT !== 'production';
    return isDev;
  }
}
