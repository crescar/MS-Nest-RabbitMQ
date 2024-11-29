import { OrderController } from "./order.controller";
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { of } from 'rxjs';
import { microservicesOrderConfiguration } from "@app/common/config/ms.config";
import { OrderStatusResponse } from "@app/common/Dtos/orders/ordersStatusResponse.dto";
import { OrderResponse } from "@app/common/Dtos/orders/orderResponse.dto";
import { CreateOrderResponse } from "@app/common/Dtos/orders/CreateOrderResponse.dto";


describe('OrderController', () => {
  let controller: OrderController;

  const listOrderResponse : StandartResponse<StandarPaginatedData<OrderResponse[]>> = {
    status: 'success',
    message: 'success',
    error: undefined,
    data: {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 1,
        items: [
            {
                id: 1,
                statusId: 1,
                status: {
                    name: 'pending'
                },
                dish: {
                    name: 'test',
                    description: 'test'
                }
            }
        ]
    }
  }

  const statusOrderResponse: StandartResponse<OrderStatusResponse[]> = {
    status: 'success',
    message: 'success',
    error: undefined,
    data: [
        {
            id: 1,
            name: 'peding'
        }
    ]
  }

  const getOrderResponse: StandartResponse<OrderResponse> = {
    status: 'success',
    message: 'success',
    error: undefined,
    data:  {
        id: 1,
        statusId: 1,
        status: {
            name: 'pending'
        },
        dish: {
            name: 'test',
            description: 'test'
        }
    }
  }

  const createOrderResponse: StandartResponse<CreateOrderResponse> = {
    status: 'success',
    message: 'success',
    error: undefined,
    data: {
        orderId: 1,
        dish: 'test',
        status: 'pending',
        description: 'test'
    }
  }

  const updateOrderResponse : StandartResponse<undefined> = {
    status: 'success',
    message: 'success',
    error: undefined,
    data: undefined
  }
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
            provide: ClientProxy,
            useValue: {
              send: jest.fn()
            },
        },
        {
            provide: microservicesOrderConfiguration.name,
            useValue: {
                send: jest.fn().mockImplementation((...args) => {
                    switch (args[0]) {
                        case 'list_orders':
                            return of(listOrderResponse)
                        case 'get_order_status':
                            return of(statusOrderResponse)
                        case 'get_order':
                            return of(getOrderResponse)
                        case 'create_order':
                            return of(createOrderResponse)
                        case 'update_order':
                            return of(updateOrderResponse)
                        default:
                            return of()
                    }
                })
            }
        }
      ],
    }).compile();
    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call orderService.send(list_orders) with the correct arguments', async () => { 
    expect(await controller.listAllOrders(1, 10, 1, 'search')).toEqual(listOrderResponse)
  })

  it('should call orderService.send(get_order_status) with the correct arguments', async () => { 
    expect(await controller.getOrderStatus()).toEqual(statusOrderResponse)
  })

  it('should call orderService.send(get_order) with the correct arguments', async () => { 
    expect(await controller.getOrderById(1)).toEqual(getOrderResponse)
  })

  it('should call orderService.send(create_order) with the correct arguments', async () => { 
    expect(await controller.createOrder()).toEqual(createOrderResponse)
  })

  it('should call orderService.send(update_order) with the correct arguments', async () => { 
    expect(await controller.updateOrder(1, {statusId: 1})).toEqual(updateOrderResponse)
  })

});
