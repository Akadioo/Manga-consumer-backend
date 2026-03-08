import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import { Address } from './entities/address.entity';
import { AddressesCrudService } from 'src/providers/crud/addresses.crud/addresses.crud.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { ReadAddressDto } from './dto/read-addresses.dto';
import { UpdateAddressDto } from './dto/update-addresses.dto';

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(private readonly addressesCrud: AddressesCrudService) {}

  async create(dto: CreateAddressDto): Promise<Address> {
    try {
      this.logger.log(`Creando dirección para usuario: ${dto.userId}`);
      return await this.addressesCrud.create(dto);
    } catch (error) {
      this.logger.error(`Error creando dirección: ${error.message}`);
      throw new InternalServerErrorException('Error creando dirección');
    }
  }

  async findByParams(dto: ReadAddressDto) {
    try {
      return await this.addressesCrud.findByParams(dto);
    } catch (error) {
      this.logger.error(`Error obteniendo direcciones: ${error.message}`);
      throw new InternalServerErrorException('Error obteniendo direcciones');
    }
  }

  async findById(id: string) {
    try {
      const address = await this.addressesCrud.findById(id);
      if (!address) throw new NotFoundException('Dirección no encontrada');
      return address;
    } catch (error) {
      this.logger.error(`Error buscando dirección ${id}: ${error.message}`);
      throw new InternalServerErrorException('Error buscando dirección');
    }
  }

  async updateById(id: string, dto: UpdateAddressDto): Promise<Address> {
    try {
      return await this.addressesCrud.updateById(id, dto);
    } catch (error) {
      this.logger.error(`Error actualizando dirección: ${error.message}`);
      throw new InternalServerErrorException('Error actualizando dirección');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      return await this.addressesCrud.remove(id);
    } catch (error) {
      this.logger.error(`Error eliminando dirección: ${error.message}`);
      throw new InternalServerErrorException('Error eliminando dirección');
    }
  }
}
