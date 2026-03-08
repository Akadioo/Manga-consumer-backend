import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { CrudModule } from 'src/providers/crud/crud.module';
import { CloudflareService } from 'src/providers/cloudflare/cloudflare.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CrudModule, UsersModule],
  controllers: [MangaController],
  providers: [MangaService, CloudflareService],
})
export class MangaModule {}
