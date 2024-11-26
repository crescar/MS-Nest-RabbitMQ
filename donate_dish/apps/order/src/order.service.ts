import { Injectable, HttpException, Inject} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatusEntity } from '@app/common';
import { TaskProducerBullQueue } from './tasks/producer.task';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { CreateOrderResponse } from './responses/createOrder.response';
import { microservicesDishConfiguration } from '@app/common/config/ms.config';
import { KitchenDataDto } from '@app/common/Dtos/orders/kitchenData.dto';

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

  async createOrder(): Promise<StandartResponse<CreateOrderResponse | undefined>> {
    const randomDish = await firstValueFrom(this.dishService.send('get_random_dish',{}));
    try {
      const order = new OrderEntity();
      order.dishId = randomDish.data.id;
      order.statusId = 1;
      await this.orderRepository.save(order);
      const dataToKitchen = this.mapperRecipiet(order.id,randomDish.data.id,randomDish.data.ingredients);
      await this.taskProducer.sendToKitchen(dataToKitchen);
      return {
        status: true,
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
        status: false,
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

  async getOrder(id: number) {
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
      throw new HttpException({
        status: 'error',
        message: 'Error to get order',
        data: undefined,
        error: error?.message ?? 'Error to get order'
      }, 404);
    }
  }

  async updateOrder(dataDto: any) {
    
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
      throw new HttpException({
        status: 'error',
        message: 'Error to update order',
        data: undefined,
        error: error?.message ?? 'Error to update order'
      }, 404);
    }

    
  }

  async listOrders(dataDto: any) {
    try {
      const totalItems = await this.orderRepository.count({
        ...(dataDto.status ? {where: {statusId: dataDto.status}} : {})
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
        take: limit,
        skip: (page - 1)* limit,
        ...(dataDto.status ? {where: {statusId: dataDto.status}} : {})
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
      throw new HttpException({
        status: 'error',
        message: 'Error to get orders',
        data: undefined,
        error: error?.message ?? 'Error to get orders'
      }, 404);
    }
    
  }

  async getOrderStatus() {
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
      console.log(error)
      throw new HttpException({
        status: 'error',
        message: 'Error to get orders',
        data: undefined,
        error: error?.message ?? 'Error to get orders'
      }, 404);
    }
  }

}