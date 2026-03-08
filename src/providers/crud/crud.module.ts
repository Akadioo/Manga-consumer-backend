import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UsersCrudService } from './users.crud/users.crud.service';
import { MangasCrudService } from './manga.crud/manga.crud.service';
import { EditorialsCrudService } from './editorial.crud/editorial.crud.service';
import { TomeCrudService } from './tome.crud/tome.crud.service';
import { AddressesCrudService } from './addresses.crud/addresses.crud.service';
import { OrdersCrudService } from './orders.crud/orders.crud.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get<number>('requestTimeout') || 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [
    UsersCrudService,
    MangasCrudService,
    EditorialsCrudService,
    TomeCrudService,
    AddressesCrudService,
    OrdersCrudService,
  ],
  exports: [
    UsersCrudService,
    MangasCrudService,
    EditorialsCrudService,
    TomeCrudService,
    AddressesCrudService,
    OrdersCrudService,
  ],
})
export class CrudModule {}
