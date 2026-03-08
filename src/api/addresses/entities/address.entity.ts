import { User } from 'src/api/users/entities/user.entity';
import { Order } from 'src/api/orders/entities/order.entity';

export class Address {
  id: string;

  country: string;

  region: string;

  province: string;

  district: string;

  street: string;

  number: string;

  aditional_information?: string;

  user: User;

  orders?: Order[];
}
