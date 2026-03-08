import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configurations from './config/configurations';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { customLogger } from './logger/logger';
import { UsersModule } from './api/users/users.module';
import { SecurityModule } from './security/security.module';
import { MangaModule } from './api/manga/manga.module';
import { EditorialModule } from './api/editorial/editorial.module';
import { CloudflareService } from './providers/cloudflare/cloudflare.service';
import { HealthModule } from './api/health/health.module';
import { TomeModule } from './api/tome/tome.module';
import { MercadoPagoModule } from './payments/mercadopago/mercadopago.module';
import { ResendModule } from './providers/mail/resend.module';
import { AddressesModule } from './api/addresses/addresses.module';
import { Order } from 'mercadopago';
import { OrdersModule } from './api/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: customLogger,
    }),

    UsersModule,
    SecurityModule,
    MangaModule,
    EditorialModule,
    TomeModule,
    HealthModule,
    MercadoPagoModule,
    ResendModule,
    AddressesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudflareService],
  exports: [CloudflareService],
})
export class AppModule {}
