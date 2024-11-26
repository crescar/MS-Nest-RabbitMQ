import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { EventPattern } from '@nestjs/microservices';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { CreateOrderResponse } from './responses/createOrder.response';



@Controller('order')
export class OrderController {

  constructor(
    private readonly orderService: OrderService
  ) {}

  @EventPattern('create_order')
  private async createOrder() : Promise<StandartResponse<CreateOrderResponse | undefined>> {
    return await this.orderService.createOrder();
  }

  @EventPattern('get_order')
  private getOrder(id)  {
    return this.orderService.getOrder(id);
  }

  @EventPattern('update_order')
  private updateOrder(data)  {
    return this.orderService.updateOrder(data)
  }

  @EventPattern('list_orders')
  private async listOrders(data)  {
    return await this.orderService.listOrders(data);
  }

  @EventPattern('get_order_status')
  private async getOrderStatus()  {
    return await this.orderService.getOrderStatus();
  }

}
