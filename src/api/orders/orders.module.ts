import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CrudModule } from 'src/providers/crud/crud.module';
import { UsersModule } from '../users/users.module';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [CrudModule, SecurityModule, UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
