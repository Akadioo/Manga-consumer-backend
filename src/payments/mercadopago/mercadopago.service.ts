import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { CreatePreferenceDto } from './dto/create-mercadopago.dto';
import { OrdersService } from 'src/api/orders/orders.service';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private readonly client: Preference;
  private readonly paymentClient: Payment;
  private readonly frontendUrl: string;
  private readonly backendUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
  ) {
    const accessToken = this.configService.get<string>(
      'MERCADOPAGO_ACCESS_TOKEN',
    );

    if (!accessToken) {
      throw new Error('Falta MERCADOPAGO_ACCESS_TOKEN en el .env');
    }

    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'https://mangaweb.onrender.com';

    this.backendUrl =
      this.configService.get<string>('CONSUMER_URL') ||
      'https://manganostore-consumer-1.onrender.com';

    const mp = new MercadoPagoConfig({ accessToken });

    this.client = new Preference(mp);
    this.paymentClient = new Payment(mp);
  }

  async createPreference(dto: CreatePreferenceDto) {
    const notificationUrl = `${this.backendUrl}/payments/webhook`;

    const preference = await this.client.create({
      body: {
        items: dto.items.map((item, i) => ({
          id: `item-${i + 1}`,
          title: item.title,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          currency_id: 'CLP',
        })),
        back_urls: {
          success: `${this.frontendUrl}/carrito/pago/exitoso`,
          failure: `${this.frontendUrl}/carrito/pago/fallido`,
          pending: `${this.frontendUrl}/carrito/pago/pendiente`,
        },
        auto_return: 'approved',
        external_reference: dto.orderId ?? 'no-order-id',
        notification_url: notificationUrl,
      },
    });

    return {
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    };
  }

  async handlePaymentNotification(body: any) {
    const event = body.action || body.type || body.topic;
    if (!event || !event.includes('payment')) return;

    const paymentId =
      body.data?.id ||
      body['data.id'] ||
      (body.resource ? body.resource.split('/').pop() : null);

    if (!paymentId) return;

    const payment = await this.paymentClient.get({ id: paymentId });

    const { status, external_reference, payer, date_approved } = payment;

    const orderId: string = external_reference ?? 'no-order-id';
    const payerEmail = payer?.email ?? null;

    const normalizedPaymentStatus =
      status === 'approved'
        ? 'Paid'
        : status === 'pending'
          ? 'Pending'
          : 'Failed';

    await this.ordersService.syncMercadoPagoPayment({
      orderId,
      status: status ?? 'pending',
      paymentStatus: normalizedPaymentStatus,
      paymentDate: date_approved ? new Date(date_approved) : null,
      paymentGatewayTransactionId: paymentId,
      payerEmail,
      paymentData: {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        net_received_amount: payment.transaction_details?.net_received_amount,
        payment_method: payment.payment_method_id,
        payment_type: payment.payment_type_id,
        issuer: payment.issuer_id,
        date_approved: payment.date_approved,
        payer: {
          id: payment.payer?.id,
          email: payment.payer?.email,
          type: payment.payer?.type,
          identification: payment.payer?.identification?.number,
        },
        fee_amount:
          payment.fee_details?.reduce((acc, f) => acc + (f.amount ?? 0), 0) ??
          0,
      },
    });
    if (status === 'approved') {
      try {
        await this.ordersService.applyStockUpdateFromPayment(orderId);
      } catch (err) {
        this.logger.error(
          ` Error aplicando stock para orden ${orderId}: ${err.message}`,
        );
      }
    }
  }
}
