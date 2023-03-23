import { CreateOrderDto } from '../dto/create-order.dto';

export interface CreateOrder extends CreateOrderDto {
  id: number;
}
