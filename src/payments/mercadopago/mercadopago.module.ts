import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from './mercadopago.controller';
import { CrudModule } from 'src/providers/crud/crud.module';
import { OrdersModule } from 'src/api/orders/orders.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, OrdersModule],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
})
export class MercadoPagoModule {}
