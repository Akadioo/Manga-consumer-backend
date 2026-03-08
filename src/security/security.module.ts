import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppTokenGuard } from './app-token.guard';
import { RolesGuard } from './roles.guard';
import { UsersModule } from 'src/api/users/users.module';
import { SessionTokenGuard } from './session-token.guard';
import { UsersService } from 'src/api/users/users.service';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [SessionTokenGuard, RolesGuard],
  exports: [SessionTokenGuard, RolesGuard],
})
export class SecurityModule {}
