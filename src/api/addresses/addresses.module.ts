import { Module } from '@nestjs/common';
import { CrudModule } from 'src/providers/crud/crud.module';
import { UsersModule } from '../users/users.module';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  imports: [CrudModule, UsersModule],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
