import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TomeCrudService } from 'src/providers/crud/tome.crud/tome.crud.service';
import { CloudflareService } from 'src/providers/cloudflare/cloudflare.service';
import { Tome } from './entities/tome.entity';
import { CreateTomeDto } from './dto/create-tome.dto';
import { ReadTomeDto } from './dto/read-tome.dto';
import { UpdateTomeDto } from './dto/update-tome.dto';

@Injectable()
export class TomeService {
  private readonly logger = new Logger(TomeService.name);

  constructor(
    private readonly tomeCrudService: TomeCrudService,
    private readonly cloudflareService: CloudflareService,
  ) {}

  async create(createTomeDto: any, image?: Express.Multer.File): Promise<Tome> {
    this.logger.log('[TomeService] Iniciando creación de tomo...');

    try {
      const safeClone: Record<string, string> = {};
      for (const [key, value] of Object.entries(createTomeDto)) {
        if (typeof value === 'string') {
          safeClone[key] = value;
        } else if (value && typeof value === 'object' && 'value' in value) {
          safeClone[key] = (value as any).value;
        }
      }

      let imageUrl = safeClone.image_tomo_url ?? null;

      if (image && image.buffer && image.buffer.length > 0) {
        this.logger.debug(
          `Archivo recibido: ${image.originalname} (${image.mimetype}, ${image.size} bytes)`,
        );

        const fileName = `tomes/${Date.now()}-${
          image.originalname?.replace(/\s+/g, '_') || 'upload.jpg'
        }`;

        imageUrl = await this.cloudflareService.uploadFile(
          image.buffer,
          fileName,
          image.mimetype,
        );

        this.logger.log(`Imagen subida correctamente: ${imageUrl}`);
      } else {
        this.logger.warn('No se recibió imagen o el buffer está vacío.');
      }

      const payload: Record<string, any> = {
        volumen: safeClone.volumen,
        isbn: safeClone.isbn,
        type: safeClone.type,
        ean: safeClone.ean,
        price: safeClone.price,
        stock: safeClone.stock,
        book_series_id: safeClone.book_series_id,
        image_tomo_url: imageUrl,
      };

      const newTome = await this.tomeCrudService.create(
        payload as unknown as CreateTomeDto,
      );

      this.logger.log(`Tome creado exitosamente en CRUD: ${newTome.id}`);
      return newTome;
    } catch (error: any) {
      this.logger.error(`Error creando tomo: ${error.message}`);
      throw new InternalServerErrorException('Error creando el tomo');
    }
  }

  async findTomeByParams(readTomeDto?: ReadTomeDto): Promise<Tome[]> {
    try {
      const params = {
        ...readTomeDto,
        limit: readTomeDto?.limit,
      };
      const tomesResponse = await this.tomeCrudService.findTomeByParams(params);

      return tomesResponse.map((tome: any) => ({
        ...tome,
        quantityOnHand: tome.quantityOnHand,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Local error fetching users by params',
      );
    }
  }

  async findOne(id: string): Promise<Tome> {
    try {
      const tome = await this.tomeCrudService.findTomeById(id);
      if (!tome) throw new NotFoundException(`Tome con ID ${id} no encontrado`);
      return tome;
    } catch (error: any) {
      if (error.response?.status === 404)
        throw new NotFoundException(`Tome con ID ${id} no encontrado`);
      this.logger.error(`Error obteniendo tomo: ${error.message}`);
      throw new InternalServerErrorException('Error obteniendo tomo');
    }
  }

  async update(
    id: string,
    updateTomeDto: UpdateTomeDto,
    image?: Express.Multer.File,
  ): Promise<Tome> {
    try {
      let imageUrl = updateTomeDto.image_tomo_url;

      if (image && image.buffer && image.buffer.length > 0) {
        this.logger.debug(
          `Nueva imagen recibida para actualizar: ${image.originalname}`,
        );

        const fileName = `tomes/${Date.now()}-${
          image.originalname?.replace(/\s+/g, '_') || 'upload.jpg'
        }`;

        imageUrl = await this.cloudflareService.uploadFile(
          image.buffer,
          fileName,
          image.mimetype,
        );

        this.logger.log(`Imagen actualizada en Cloudflare R2`);
      }

      const payload = {
        ...updateTomeDto,
        image_tomo_url: imageUrl,
      };

      const updated = await this.tomeCrudService.updateTomeById(id, payload);

      if (!updated)
        throw new NotFoundException(`Tome con ID ${id} no encontrado`);

      this.logger.log(`Tome actualizado correctamente: ${id}`);
      return updated;
    } catch (error: any) {
      this.logger.error(`Error actualizando tomo: ${error.message}`);
      throw new InternalServerErrorException('Error actualizando tomo');
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const result = await this.tomeCrudService.removeMangaById(id);
      if (!result || result.affected === 0)
        throw new NotFoundException('Tome no encontrado');
      this.logger.log(`Tome eliminado: ${id}`);
      return 'Tome eliminado correctamente';
    } catch (error: any) {
      this.logger.error(`Error eliminando tomo: ${error.message}`);
      throw new InternalServerErrorException('Error eliminando tomo');
    }
  }
}
