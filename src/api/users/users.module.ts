import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CrudModule } from 'src/providers/crud/crud.module';
import { Resend } from 'resend';
import { ResendService } from 'src/providers/mail/resend.service';

@Module({
  imports: [CrudModule],
  controllers: [UsersController],
  providers: [UsersService, ResendService],
  exports: [UsersService],
})
export class UsersModule {}
