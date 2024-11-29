import { Injectable, HttpException, Inject} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatusEntity } from '@app/common';
import { TaskProducerBullQueue } from './tasks/producer.task';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
//import { CreateOrderResponse } from './responses/createOrder.response';
import { microservicesDishConfiguration } from '@app/common/config/ms.config';
import { KitchenDataDto } from '@app/common/Dtos/orders/kitchenData.dto';
import { CreateOrderResponse } from '@app/common/Dtos/orders/CreateOrderResponse.dto';
import { OrderResponse } from '@app/common/Dtos/orders/orderResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { OrderStatusResponse } from '@app/common/Dtos/orders/ordersStatusResponse.dto';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';
import { UpdateOrderDto } from '@app/common/Dtos/orders/updateOrder.dto';

@Injectable()
export class OrderService {

  constructor(
    @Inject(microservicesDishConfiguration.name) private readonly dishService: ClientProxy,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly taskProducer: TaskProducerBullQueue,
    @InjectRepository(OrderStatusEntity)
    private readonly orderStatusRepository: Repository<OrderStatusEntity>
  ) {}

  async createOrder(): Promise<StandartResponse<CreateOrderResponse>> {
    const randomDish: StandartResponse<any> = await firstValueFrom(this.dishService.send('get_random_dish',{}));
    if(randomDish.error){
      return {
        status: 'error',
        message: 'Error to get random dish',
        data: undefined,
        error: randomDish.error
      }
    }
    try {
      const order = new OrderEntity();
      order.dishId = randomDish.data.id;
      order.statusId = 1;
      await this.orderRepository.save(order);
      const dataToKitchen = this.mapperRecipiet(order.id,randomDish.data.id,randomDish.data.ingredients);
      await this.taskProducer.sendToKitchen(dataToKitchen);
      return {
        status: 'success',
        message: 'Order created',
        data: {
          orderId: order.id,
          status: 'pending',
          dish: randomDish.data.name,
          description : randomDish.data.description
        },
        error: undefined
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error to create Order',
        data: undefined,
        error: error?.message ?? 'Error to create Order'
      }
    }
  }

  mapperRecipiet(orderId,dishId,ingredients): KitchenDataDto{
    const getIngredients = ingredients.map((ingredient)=>{
      return {
        ingredientId: ingredient.ingredient_id,
        quantityToPrepared: ingredient.quantity,
        quantityStorage: ingredient.storage.quantity,
        name: ingredient.storage.name,
        needToBuy: ingredient.quantity > ingredient.storage.quantity
      }
    })
    return {
      orderId,
      dishId,
      ingredients: getIngredients
    }
  }

  async getOrder(id: number) : Promise<StandartResponse<OrderResponse>> {
    try {
      return {
        status: 'success',
        message: 'Order found',
        data: await this.orderRepository.findOneOrFail(
          {
            where: {
              id
            },
            relations: {
              dish: true,
              status: true
            },
            select: {
              id:true,
              statusId:true,
              dish: {
                name: true,
                description: true
              },
              status: {
                name: true
              }
            }
          }
        ),
        error: undefined
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error to get order',
        data: undefined,
        error: error?.message ?? 'Error to get order'
      }
    }
  }

  async updateOrder(dataDto: UpdateOrderDto): Promise<StandartResponse<undefined>>  {
    try {
      await this.orderRepository.update(dataDto.id,{
        statusId: dataDto.statusId
      })
      return {
        status: 'success',
        message: 'Order updated',
        data: undefined,
        error: undefined
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error to update order',
        data: undefined,
        error: error?.message ?? 'Error to update order'
      }
    }
  }

  async listOrders(dataDto: PaginateParamsDto): Promise<StandartResponse<StandarPaginatedData<OrderResponse[]>>> {
    try {
      const totalItems = await this.orderRepository.count({
        where: {
          ...(dataDto.status ? {statusId: dataDto.status} : {}),
          ...(dataDto.search ? {dish: {name: dataDto.search}} : {})
        }
      });
      const page = dataDto.page ?? 1
      const limit = dataDto.limit ?? 10
      const totalPages = Math.ceil(totalItems / limit)

      const items = await this.orderRepository.find({
        select:{
          id: true,
          statusId: true,
          dish: {
            name: true,
            description: true
          }
        },
        relations: {
          dish: true,
          status: true
        },
        order: {
          id: 'ASC'
        },
        take: limit,
        skip: (page - 1)* limit,
        where: {
          ...(dataDto.status ? {statusId: dataDto.status} : {}),
          ...(dataDto.search ? {dish: {name: dataDto.search}} : {})
        }
      })

      return {
        status: 'success',
        message: 'Orders listed',
        data: {
          items,
          page,
          limit,
          totalPages,
          totalItems
        },
        error: undefined
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error to get orders',
        data: undefined,
        error: error?.message ?? 'Error to get orders'
      }
    }
    
  }

  async getOrderStatus(): Promise<StandartResponse<OrderStatusResponse[]>>  {
    try {
      return {
        status: 'success',
        message: 'Order status listed',
        data: await this.orderStatusRepository.find(
          {
            select: {
              id: true,
              name: true
            }
          }
        ),
        error: undefined
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error to get orders',
        data: undefined,
        error: error?.message ?? 'Error to get orders'
      }
    }
  }

}