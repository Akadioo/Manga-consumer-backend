import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MercadoPagoService } from './mercadopago.service';
import { CreatePreferenceDto } from './dto/create-mercadopago.dto';
import { Public } from 'src/utils/decorators/public.decorator';

@ApiTags('Pagos')
@Controller('payments')
export class MercadoPagoController {
  constructor(private readonly mpService: MercadoPagoService) {}

  @Post('create-preference')
  @ApiOperation({
    summary:
      'Crear preferencia de pago en Mercado Pago (retorna init_point para checkout)',
  })
  async createPreference(@Body() dto: CreatePreferenceDto) {
    return this.mpService.createPreference(dto);
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Webhook de Mercado Pago (notificaciones de pago)',
  })
  async handleWebhook(@Body() body: any) {
    await this.mpService.handlePaymentNotification(body);
    return { received: true };
  }
}
