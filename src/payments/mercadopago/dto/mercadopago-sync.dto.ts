export interface MercadoPagoSyncPayload {
  orderId: string;
  status: string;
  paymentStatus?: string;
  paymentDate?: Date | null;
  paymentGatewayTransactionId: string;
  payerEmail: string | null;
  paymentData?: any;
}
