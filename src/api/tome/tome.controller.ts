import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
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
import { FileInterceptor } from '@blazity/nest-file-fastify';
import { TomeService } from './tome.service';
import { CreateTomeDto } from './dto/create-tome.dto';
import { UpdateTomeDto } from './dto/update-tome.dto';
import { ReadTomeDto } from './dto/read-tome.dto';
import { Public } from 'src/utils/decorators/public.decorator';
import { Tome } from './entities/tome.entity';
import { SessionTokenGuard } from 'src/security/session-token.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';

@ApiTags('Tomes')
@UseGuards(SessionTokenGuard, RolesGuard)
@Controller('tomes')
export class TomeController {
  constructor(private readonly tomeService: TomeService) {}


  @Roles('ADMIN')
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        volumen: { type: 'integer', example: 1 },
        isbn: { type: 'string', example: '978-1234567890' },
        type: { type: 'string', example: 'Tankobon' },
        ean: { type: 'string', example: '1234567890123' },
        price: { type: 'number', example: 10990 },
        stock: { type: 'integer', example: 15 },
        book_series_id: {
          type: 'string',
          format: 'uuid',
          example: 'c0e86e7b-5a6a-4f1d-a05d-ccdabaa6a9e8',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (opcional)',
        },
      },
      required: ['volumen', 'isbn', 'type', 'price', 'stock', 'book_series_id'],
    },
  })
  async create(@Body() rawBody: any) {
    const cleanBody: Record<string, any> = {};
    for (const [key, val] of Object.entries(rawBody)) {
      cleanBody[key] =
        val && typeof val === 'object' && 'value' in val
          ? (val as any).value
          : val;
    }

    const fileField = rawBody.image;
    let imageFile: Express.Multer.File | undefined = undefined;

    if (fileField) {
      try {
        const fileBuffer =
          typeof fileField.toBuffer === 'function'
            ? await fileField.toBuffer()
            : Buffer.from([]);

        imageFile = {
          buffer: fileBuffer,
          originalname: fileField.filename || 'sin_nombre',
          mimetype: fileField.mimetype || 'desconocido',
        } as any;
      } catch (err) {
        throw new BadRequestException('No se pudo procesar la imagen.');
      }
    }

    try {
      return await this.tomeService.create(cleanBody, imageFile);
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Error al crear tomo',
      );
    }
  }


  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener lista de tomos (filtrable)' })
  async findAll(@Query() readTomeDto?: ReadTomeDto): Promise<Tome[]> {
    return this.tomeService.findTomeByParams(readTomeDto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tomo por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del tomo' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tomeService.findOne(id);
  }


  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Actualizar un tomo (imagen opcional)' })
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() rawBody: any,
  ) {
    const cleanBody = Object.fromEntries(
      Object.entries(rawBody).map(([key, val]: [string, any]) => [
        key,
        val?.value ?? val,
      ]),
    );
    const dto: UpdateTomeDto = cleanBody as UpdateTomeDto;
    return this.tomeService.update(id, dto, image);
  }


  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tomo' })
  @ApiParam({ name: 'id', description: 'UUID del tomo' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tomeService.remove(id);
  }
}
