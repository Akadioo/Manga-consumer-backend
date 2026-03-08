import { Module } from '@nestjs/common';
import { TomeService } from './tome.service';
import { TomeController } from './tome.controller';
import { CrudModule } from 'src/providers/crud/crud.module';
import { CloudflareService } from 'src/providers/cloudflare/cloudflare.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CrudModule, UsersModule],
  controllers: [TomeController],
  providers: [TomeService, CloudflareService],
})
export class TomeModule {}
