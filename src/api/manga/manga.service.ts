import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { ReadMangaDto } from './dto/read-manga.dto';
import { Manga } from './entities/manga.entity';
import { MangasCrudService } from 'src/providers/crud/manga.crud/manga.crud.service';
import { CloudflareService } from 'src/providers/cloudflare/cloudflare.service';

@Injectable()
export class MangaService {
  private readonly logger = new Logger(MangaService.name);

  constructor(
    private readonly mangaCrudService: MangasCrudService,
    private readonly cloudflareService: CloudflareService,
  ) {}

  async create(
    createMangaDto: any,
    image?: Express.Multer.File,
  ): Promise<Manga> {
    this.logger.log('[MangaService] Iniciando creación de manga...');

    try {
      const safeClone: Record<string, string> = {};

      for (const [key, value] of Object.entries(createMangaDto)) {
        if (typeof value === 'string') {
          safeClone[key] = value;
        } else if (value && typeof value === 'object' && 'value' in value) {
          safeClone[key] = (value as any).value;
        }
      }

      this.logger.debug(
        `DTO limpio inicial:\n${JSON.stringify(safeClone, null, 2)}`,
      );

      let imageUrl = safeClone.image_url;

      if (image && image.buffer && image.buffer.length > 0) {
        this.logger.debug(
        `Archivo recibido: ${image.originalname} (${image.mimetype}, ${image.size} bytes)`,
        );

        const fileName = `mangas/${Date.now()}-${
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
        name: safeClone.name,
        author: safeClone.author,
        genre: Array.isArray(safeClone.genre)
          ? safeClone.genre
          : safeClone.genre
            ? safeClone.genre.split(',').map((g) => g.trim())
            : [],
        issn: safeClone.issn,
        editorialId: safeClone.editorialId,
        image_url: imageUrl,
      };

      this.logger.debug(
        `Payload FINAL a enviar al CRUD:\n${JSON.stringify(payload, null, 2)}`,
      );

      const newManga = await this.mangaCrudService.create(
        payload as unknown as CreateMangaDto,
      );

      this.logger.log(`Manga creado exitosamente en CRUD: ${newManga.id}`);
      return newManga;
    } catch (error: any) {
      this.logger.error(`Error creando manga: ${error.message}`);
      throw new InternalServerErrorException('Error creando el manga');
    }
  }

  async findMangasByParams(readMangaDto?: ReadMangaDto): Promise<Manga[]> {
    try {
      const params = { ...readMangaDto, limit: readMangaDto?.limit ?? 0 };
      const mangas = await this.mangaCrudService.findMangasByParams(params);
      this.logger.debug(`${mangas.length} mangas obtenidos del CRUD`);
      return mangas;
    } catch (error: any) {
      this.logger.error(`Error al obtener mangas: ${error.message}`);
      throw new InternalServerErrorException('Error al obtener los mangas');
    }
  }

  async findOne(id: string): Promise<Manga> {
    try {
      const manga = await this.mangaCrudService.findMangaById(id);
      if (!manga) {
        throw new NotFoundException(`Manga con ID ${id} no encontrado`);
      }
      return manga;
    } catch (error: any) {
      if (error.response?.status === 404)
        throw new NotFoundException(`Manga con ID ${id} no encontrado`);
      this.logger.error(`Error obteniendo manga: ${error.message}`);
      throw new InternalServerErrorException('Error obteniendo manga');
    }
  }


  async update(id: string, updateMangaDto: UpdateMangaDto): Promise<Manga> {
    try {
      this.logger.log(`[MangaService] Actualizando manga ${id}...`);

      const filteredDto = Object.fromEntries(
        Object.entries(updateMangaDto).filter(
          ([, value]) => value !== undefined && value !== null && value !== '',
        ),
      ) as UpdateMangaDto;

      this.logger.debug(
        `Payload final a enviar al CRUD:\n${JSON.stringify(filteredDto, null, 2)}`,
      );

      const updated = await this.mangaCrudService.updateMangaById(
        id,
        filteredDto,
      );

      if (!updated) {
        throw new NotFoundException(`Manga con ID ${id} no encontrado`);
      }

      this.logger.log(`Manga actualizado correctamente: ${id}`);
      return updated;
    } catch (error: any) {
      this.logger.error(`Error actualizando manga: ${error.message}`);
      throw new InternalServerErrorException('Error actualizando el manga');
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const result = await this.mangaCrudService.removeMangaById(id);
      if (!result || result.affected === 0)
        throw new NotFoundException('Manga no encontrado');
      this.logger.log(`Manga eliminado: ${id}`);
      return 'Manga eliminado correctamente';
    } catch (error: any) {
      this.logger.error(`Error eliminando manga: ${error.message}`);
      throw new InternalServerErrorException('Error eliminando manga');
    }
  }
}
