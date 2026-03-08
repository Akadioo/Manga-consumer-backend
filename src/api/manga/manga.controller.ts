import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  BadRequestException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { MangaService } from './manga.service';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { ReadMangaDto } from './dto/read-manga.dto';
import { Public } from 'src/utils/decorators/public.decorator';
import { SessionTokenGuard } from 'src/security/session-token.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';

@ApiTags('Mangas')
@UseGuards(SessionTokenGuard, RolesGuard)
@Controller('mangas')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}


  @Roles('ADMIN')
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        author: { type: 'string' },
        genre: { type: 'string' },
        issn: { type: 'string' },
        editorialId: {
          type: 'string',
          format: 'uuid',
        },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async create(@Body() rawBody: any) {
    console.log('[POST /mangas] Iniciando creación de manga...');

    const cleanBody: Record<string, any> = {};
    for (const [key, val] of Object.entries(rawBody)) {
      cleanBody[key] =
        val && typeof val === 'object' && 'value' in val
          ? (val as any).value
          : val;
    }


    const fileField = rawBody.image;
    if (!fileField)
      throw new BadRequestException('No se recibió campo "image".');

    let fileBuffer: Buffer;
    try {
      fileBuffer =
        typeof fileField.toBuffer === 'function'
          ? await fileField.toBuffer()
          : Buffer.from([]);
    } catch {
      throw new BadRequestException('No se pudo leer la imagen.');
    }

    const imageFile = {
      buffer: fileBuffer,
      originalname: fileField.filename || 'sin_nombre',
      mimetype: fileField.mimetype || 'desconocido',
    };

    try {
      return await this.mangaService.create(cleanBody, imageFile as any);
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Error al crear manga',
      );
    }
  }


  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener lista de mangas (filtrable)' })
  async findAll(@Query() readMangaDto: ReadMangaDto) {
    return this.mangaService.findMangasByParams(readMangaDto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un manga por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del manga' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mangaService.findOne(id);
  }


  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un manga (solo texto)' })
  @ApiBody({
    description: 'Campos opcionales para actualizar el manga (JSON)',
    type: UpdateMangaDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateMangaDto,
  ) {
    try {
      const cleanBody = Object.fromEntries(
        Object.entries(body).filter(
          ([, value]) => value !== undefined && value !== null && value !== '',
        ),
      ) as UpdateMangaDto;

      return await this.mangaService.update(id, cleanBody);
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Error actualizando el manga',
      );
    }
  }


  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un manga' })
  @ApiParam({ name: 'id', description: 'UUID del manga' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mangaService.remove(id);
  }
}
