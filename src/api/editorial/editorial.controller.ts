import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  InternalServerErrorException,
  Query,
  UseGuards,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { ReadEditorialDto } from './dto/read-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import { Editorial } from './entities/editorial.entity';
import { EditorialService } from './editorial.service';
import { SessionTokenGuard } from 'src/security/session-token.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { Public } from 'src/utils/decorators/public.decorator';
import { Roles } from 'src/utils/decorators/roles.decorator';

@UseGuards(SessionTokenGuard, RolesGuard)
@ApiTags('Editorials')
@Controller('editorials')
export class EditorialController {
  private readonly logger = new Logger(EditorialController.name);

  constructor(private readonly editorialService: EditorialService) {}


  @Roles('ADMIN')
  @Post()
  async create(
    @Body() createEditorialDto: CreateEditorialDto,
  ): Promise<Editorial> {
    try {
      this.logger.log('POST /editorials');
      return await this.editorialService.create(createEditorialDto);
    } catch (error: any) {
      this.logger.error(`Error al crear editorial: ${error.message}`);
      throw new InternalServerErrorException('Error al crear la editorial');
    }
  }


  @Public()
  @Get()
  async findAll(
    @Query() readEditorialDto: ReadEditorialDto,
  ): Promise<Editorial[]> {
    try {
      this.logger.log('GET /editorials');
      return await this.editorialService.findEditorialsByParams(
        readEditorialDto,
      );
    } catch (error: any) {
      this.logger.error(`Error al obtener editoriales: ${error.message}`);
      throw new InternalServerErrorException(
        'Error al obtener las editoriales',
      );
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Editorial> {
    try {
      this.logger.log(`GET /editorials/${id}`);
      return await this.editorialService.findOne(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error al obtener editorial: ${error.message}`);
      throw new InternalServerErrorException('Error al obtener la editorial');
    }
  }


  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEditorialDto,
  ): Promise<Editorial> {
    try {
      this.logger.log(`PATCH /editorials/${id}`);
      const updated = await this.editorialService.update(id, dto);
      if (!updated) {
        throw new NotFoundException('Editorial no encontrada');
      }
      return updated;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error al actualizar editorial: ${error.message}`);
      throw new InternalServerErrorException(
        'Error al actualizar la editorial',
      );
    }
  }


  @Roles('ADMIN')
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    try {
      this.logger.log(`DELETE /editorials/${id}`);
      const result = await this.editorialService.remove(id);
      if (!result || result.affected === 0) {
        throw new NotFoundException('Editorial no encontrada');
      }
      return { message: 'Editorial eliminada correctamente' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Error al eliminar editorial: ${error.message}`);
      throw new InternalServerErrorException('Error al eliminar la editorial');
    }
  }
}
