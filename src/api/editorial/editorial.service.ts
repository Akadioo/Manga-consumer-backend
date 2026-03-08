import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import { ReadEditorialDto } from './dto/read-editorial.dto';
import { Editorial } from './entities/editorial.entity';
import { EditorialsCrudService } from 'src/providers/crud/editorial.crud/editorial.crud.service';

@Injectable()
export class EditorialService {
  private readonly logger = new Logger(EditorialService.name);

  constructor(private readonly editorialsCrudService: EditorialsCrudService) {}

  async create(createEditorialDto: CreateEditorialDto): Promise<Editorial> {
    try {
      const created =
        await this.editorialsCrudService.create(createEditorialDto);
      this.logger.log(`Editorial creada exitosamente: ${created.id}`);
      return created;
    } catch (error: any) {
      this.logger.error(`Error creando editorial: ${error.message}`);
      throw new InternalServerErrorException('Error creando la editorial');
    }
  }

  async findEditorialsByParams(
    readEditorialDto?: ReadEditorialDto,
  ): Promise<Editorial[]> {
    try {
      const params = {
        ...readEditorialDto,
        limit: readEditorialDto?.limit ?? 0,
      };
      const editorials =
        await this.editorialsCrudService.findEditorialsByParams(params);
      return editorials;
    } catch (error: any) {
      this.logger.error(`Error al obtener editoriales: ${error.message}`);
      throw new InternalServerErrorException(
        'Error al obtener las editoriales',
      );
    }
  }

  async findOne(id: string): Promise<Editorial> {
    try {
      const editorial = await this.editorialsCrudService.findEditorialById(id);
      if (!editorial)
        throw new NotFoundException(`Editorial con ID ${id} no encontrada`);
      return editorial;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Editorial con ID ${id} no encontrada`);
      }
      this.logger.error(`Error obteniendo editorial: ${error.message}`);
      throw new InternalServerErrorException('Error obteniendo editorial');
    }
  }

  async update(id: string, dto: UpdateEditorialDto): Promise<Editorial> {
    try {
      const updated = await this.editorialsCrudService.updateEditorialById(
        id,
        dto,
      );

      if (!updated)
        throw new NotFoundException(`Editorial con ID ${id} no encontrada`);

      this.logger.log(`Editorial actualizada correctamente: ${id}`);
      return updated;
    } catch (error: any) {
      this.logger.error(`Error actualizando editorial: ${error.message}`);
      throw new InternalServerErrorException('Error actualizando editorial');
    }
  }

  async remove(id: string): Promise<{ affected: number }> {
    try {
      const result = await this.editorialsCrudService.removeEditorialById(id);
      if (!result || result.affected === 0) {
        throw new NotFoundException('Editorial no encontrada');
      }
      this.logger.log(`Editorial eliminada: ${id}`);
      return { affected: result.affected };
    } catch (error: any) {
      this.logger.error(`Error eliminando editorial: ${error.message}`);
      throw new InternalServerErrorException('Error eliminando editorial');
    }
  }
}
