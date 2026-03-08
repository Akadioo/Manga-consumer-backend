import { Module } from '@nestjs/common';
import { EditorialService } from './editorial.service';
import { EditorialController } from './editorial.controller';
import { CrudModule } from 'src/providers/crud/crud.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CrudModule, UsersModule],
  controllers: [EditorialController],
  providers: [EditorialService],
  exports: [EditorialService],
})
export class EditorialModule {}
