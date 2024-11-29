import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { EventPattern } from '@nestjs/microservices';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { CreateOrderResponse } from '@app/common/Dtos/orders/CreateOrderResponse.dto';
import { OrderResponse } from '@app/common/Dtos/orders/orderResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { OrderStatusResponse } from '@app/common/Dtos/orders/ordersStatusResponse.dto';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';




@Controller('order')
export class OrderController {

  constructor(
    private readonly orderService: OrderService
  ) {}

  @EventPattern('create_order')
  private async createOrder() : Promise<StandartResponse<CreateOrderResponse>> {
    return await this.orderService.createOrder();
  }

  @EventPattern('get_order')
  private getOrder(id: number) : Promise<StandartResponse<OrderResponse>> {
    return this.orderService.getOrder(id);
  }

  @EventPattern('update_order')
  private updateOrder(data): Promise<StandartResponse<undefined>> {
    return this.orderService.updateOrder(data)
  }

  @EventPattern('list_orders')
  private async listOrders(data: PaginateParamsDto): Promise<StandartResponse<StandarPaginatedData<OrderResponse[]>>>{
    return await this.orderService.listOrders(data);
  }

  @EventPattern('get_order_status')
  private async getOrderStatus(): Promise<StandartResponse<OrderStatusResponse[]>>  {
    return await this.orderService.getOrderStatus();
  }

}
