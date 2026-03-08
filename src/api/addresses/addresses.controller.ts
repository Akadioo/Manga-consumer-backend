import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  InternalServerErrorException,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { SessionTokenGuard } from 'src/security/session-token.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { ReadAddressDto } from './dto/read-addresses.dto';
import { Roles } from 'src/utils/decorators/roles.decorator';

@ApiTags('[API] Addresses')
@Controller('addresses')
@UseGuards(SessionTokenGuard, RolesGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}


  @Post()
  async create(@Req() req, @Body() dto: CreateAddressDto) {
    try {
      
      if (req.user.role !== 'ADMIN' && dto.userId !== req.user.id) {
        throw new ForbiddenException(
          'No puedes crear direcciones para otros usuarios',
        );
      }

      return await this.addressesService.create(dto);
    } catch (e) {
      throw new InternalServerErrorException('Error creando dirección');
    }
  }

  @Get()
  async findAll(@Req() req, @Query() query: ReadAddressDto) {
    try {
   
      if (req.user.role !== 'ADMIN') {
        query.userId = req.user.id;
      }

      return await this.addressesService.findByParams(query);
    } catch (e) {
      throw new InternalServerErrorException('Error obteniendo direcciones');
    }
  }

  @Get(':id')
  async findById(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    try {
      const address = await this.addressesService.findById(id);

     
      if (req.user.role !== 'ADMIN' && address.user.id !== req.user.id) {
        throw new ForbiddenException(
          'No puedes ver direcciones de otros usuarios',
        );
      }

      return address;
    } catch (e) {
      throw new InternalServerErrorException('Error buscando dirección');
    }
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateAddressDto,
  ) {
    const address = await this.addressesService.findById(id);

    
    if (req.user.role !== 'ADMIN' && address.user.id !== req.user.id) {
      throw new ForbiddenException(
        'No puedes editar direcciones de otros usuarios',
      );
    }

    return this.addressesService.updateById(id, dto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    const address = await this.addressesService.findById(id);

   
    if (req.user.role !== 'ADMIN' && address.user.id !== req.user.id) {
      throw new ForbiddenException(
        'No puedes eliminar direcciones de otros usuarios',
      );
    }

    return this.addressesService.remove(id);
  }
}
