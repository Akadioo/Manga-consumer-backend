import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReadOrderDto } from './dto/read-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { PaginatedResponse } from 'src/providers/crud/utils/paginated.response.dto';
import { SessionTokenGuard } from 'src/security/session-token.guard';
import { RolesGuard } from 'src/security/roles.guard';
import { Public } from 'src/utils/decorators/public.decorator';
import { Roles } from 'src/utils/decorators/roles.decorator';

@UseGuards(SessionTokenGuard, RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}


  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden' })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      if (!createOrderDto.userId)
        throw new BadRequestException('El campo userId es obligatorio');
      if (!createOrderDto.type)
        throw new BadRequestException('El campo type es obligatorio');

      return await this.ordersService.create(createOrderDto);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error creando orden: ${error.message}`,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar órdenes con filtros' })
  async findByParams(
    @Req() req,
    @Query() query: ReadOrderDto,
  ): Promise<PaginatedResponse<Order>> {
    try {
      if (req.user.role === 'ADMIN') {
        delete query.userId;
      } else {
        query.userId = req.user.id;
      }

      return await this.ordersService.findByParams(query);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error listando órdenes: ${error.message}`,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  async findOne(
    @Req() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Order> {
    try {
      const order = await this.ordersService.findOne(id);
      if (!order) throw new NotFoundException('Orden no encontrada');

      if (req.user.role !== 'ADMIN' && req.user.id !== order.user.id) {
        throw new ForbiddenException('No puedes ver órdenes de otros usuarios');
      }

      return order;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error obteniendo orden: ${error.message}`,
      );
    }
  }


  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una orden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      return await this.ordersService.update(id, dto);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error actualizando orden: ${error.message}`,
      );
    }
  }


  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una orden' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    try {
      return await this.ordersService.remove(id);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error eliminando orden: ${error.message}`,
      );
    }
  }
}
