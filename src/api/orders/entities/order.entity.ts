import { User } from 'src/api/users/entities/user.entity';
import { Address } from 'src/api/addresses/entities/address.entity';

export class Order {
  id: string;

  orderDate: Date;

  status: string;

  totalPrice: number;

  type: string;

  paymentGateway: string;

  orderNumber: number;

  paymentGatewayTransactionId?: string;

  paymentStatus: string;

  paymentDate?: Date;

  purchaseDate: Date;

  user: User;

  address?: Address;
}
