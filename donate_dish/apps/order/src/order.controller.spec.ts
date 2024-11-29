import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';
import { ClientProxy } from '@nestjs/microservices';
import { microservicesDishConfiguration } from '../../../libs/common/src/config/ms.config';
import { OrderEntity, OrderStatusEntity } from '@app/common';
import { TaskProducerBullQueue } from './tasks/producer.task';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { CreateOrderResponse } from '@app/common/Dtos/orders/CreateOrderResponse.dto';
import { OrderStatusResponse } from '@app/common/Dtos/orders/ordersStatusResponse.dto';
import { UpdateOrderDto } from '../../../libs/common/src/Dtos/orders/updateOrder.dto';
import { OrderResponse } from '@app/common/Dtos/orders/orderResponse.dto';


describe('OrderController', () => {
  let orderController: OrderController;

  const getDisheResponse: StandartResponse<any> ={
    status: 'success',
    message: 'Get random dish',
    data: {
      id: 1,
      name: 'test',
      description: 'test',
      ingredients: [
        {
          ingredient_id: 1,
          quantity: 1,
          storage: {
            name: 'test',
            quantity: 5
          }
        }
      ]
    },
    error: undefined
  }


  const createOrderResponse: StandartResponse<CreateOrderResponse> = {
    status: 'success',
    message: 'Order created',
    data: {
      orderId: undefined,
      status: 'pending',
      dish: 'test',
      description: 'test'
    },
    error: undefined
  }

  const gerStatusOrderData: OrderStatusResponse[] = [
    {
      id: 1,
      name: 'pending'
    }
  ] 

  const getStatusOrderResponse: StandartResponse<OrderStatusResponse[]> = {
    status: 'success',
    message: 'Order status listed',
    data: gerStatusOrderData,
    error: undefined
  }

  const updateOrderDto: UpdateOrderDto = {
    id: 1,
    statusId: 1
  }

  const updateOrderResponse: StandartResponse<any> = {
    status: 'success',
    message: 'Order updated',
    data: undefined,
    error: undefined
  }

  const listOrderData:OrderResponse[] = [
    {
      id: 1,
      status: {
        name: 'pending'
      },
      dish: {
        name: 'test',
        description: 'test'
      },
      statusId: 1
    }
  ]

  const listOrderResponse: StandartResponse<StandarPaginatedData<OrderResponse[]>> = {
    status: 'success',
    message: 'Orders listed',
    data: {
      totalItems: 1,
      totalPages: 1,
      page: 1,
      limit: 10,
      items: listOrderData
    },
    error: undefined
  }

  const getOrderResponse: StandartResponse<OrderResponse> = {
    status: 'success',
    message: 'Order found',
    data: listOrderData[0],
    error: undefined
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: ClientProxy,
          useValue: {
            send: jest.fn().mockReturnValue(of())
          },
        },
        {
          provide: microservicesDishConfiguration.name,
          useValue: {
            send: jest.fn().mockReturnValue(of(getDisheResponse))
          }
        },
        {
          provide: TaskProducerBullQueue,
          useValue: {
            sendToKitchen: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            save: jest.fn(),
            count: jest.fn().mockResolvedValue(1),
            findOneOrFail: jest.fn().mockResolvedValue(listOrderData[0]),
            update: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue(listOrderData)
          }
        },
        {
          provide: getRepositoryToken(OrderStatusEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(gerStatusOrderData)
          }
        }
      ],
    }).compile();

    orderController = app.get<OrderController>(OrderController);
  });

  
  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });

  it('should call OrderController.send(create_order) with the correct arguments', async () => {
    expect(await orderController.createOrder()).toEqual(createOrderResponse)
  } )

  it('should call OrderController.send(get_order) with the correct arguments', async () => {
    expect(await orderController.getOrder(1)).toEqual(getOrderResponse)
  } )

  it('should call OrderController.send(update_order) with the correct arguments', async () => {
    expect(await orderController.updateOrder(updateOrderDto)).toEqual(updateOrderResponse)
  } )

  it('should call OrderController.send(list_orders) with the correct arguments', async () => {
    expect(await orderController.listOrders(new PaginateParamsDto())).toEqual(listOrderResponse)
  } )

  it('should call OrderController.send(get_order_status) with the correct arguments', async () => {
    expect(await orderController.getOrderStatus()).toEqual(getStatusOrderResponse)
  } )

});
