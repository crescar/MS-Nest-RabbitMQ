import { microservicesOrderConfiguration } from '@app/common/config/ms.config';
import { UpdateOrderDto } from '@app/common/Dtos/orders/updateOrder.dto';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { Controller, Inject, Post, Get, Put, Query, Param, Body, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';


@Controller('order')
export class OrderController {

  constructor(
    @Inject(microservicesOrderConfiguration.name) private readonly orderService: ClientProxy
  ){}
  

  @Get()
  @ApiParam({ name: 'page', required: false })
  @ApiParam({ name: 'limit', required: false })
  @ApiParam({ name: 'status', required: false })
  @ApiResponse({
    status: 200,
    type: StandartResponse<any>
  })
  async listAllOrders(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: number
  ): Promise<StandartResponse<any>> 
  {
    return await firstValueFrom(this.orderService.send('list_orders', {page, limit, status}));
  }

  @Get('/status')
  @ApiResponse({
    status: 200,
    type: StandartResponse<any>
  })
  async getOrderStatus(): Promise<StandartResponse<any>>{
    return await firstValueFrom(this.orderService.send('get_order_status', {}));
  }

  @Get(':orderId')
  @ApiResponse({
    status: 200,
    type: StandartResponse<any>
  })
  async getOrderById(
    @Param('orderId') id: number
  ): Promise<StandartResponse<any>> 
  {
    return await firstValueFrom(this.orderService.send('get_order', id));
  }

  @Post()
  @ApiResponse({
    status: 201,
    type: StandartResponse<any>
  })
  async createOrder(): Promise<StandartResponse<any>> 
  {
    const order:StandartResponse<any> = await firstValueFrom(this.orderService.send('create_order', {}));
    if(!order.status){
      throw new HttpException(order, 400)
    }
    return order
  }

  @Put(':orderId')
  @ApiBody({
    type: UpdateOrderDto
  })
  @ApiResponse({
    status: 201,
    type: StandartResponse<any>
  })
  async updateOrder(
    @Param('orderId') id: number,
    @Body() body: any
  ) : Promise<StandartResponse<any>> 
  {
    return await firstValueFrom(this.orderService.send('update_order', {id, ...body}))
  }

}
