import { Address } from 'src/api/addresses/entities/address.entity';
import { Order } from 'src/api/orders/entities/order.entity';

export class User {
  id: string;

  name: string;

  surname: string;

  phone?: string;

  email: string;

  passwordHash: string;

  verified: boolean;

  userAuthToken?: string;

  verificationToken?: string;

  type: string;

  orders?: Order[];

  addresses: Address[];
}
