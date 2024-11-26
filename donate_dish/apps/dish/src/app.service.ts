import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DishEntity } from '../../../libs/common/src/entities/dish.entity';



@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}
  async getRamdonDish(): Promise<any> {
    try {
      const countDishes = await this.dishRepository.count();
      const randomDish = Math.ceil(Math.random() * countDishes);
      const dish = await this.dishRepository.findOneOrFail(
        {
          where: {
            id: randomDish
          },
          relations: {
            ingredients: {
              storage: true
            }
          }
        }
      )  
      return {
        status: 'success',
        message: 'Dish found',
        data: dish,
        error: undefined
      }
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Dish not found',
        data: undefined,
        error: error?.message ?? 'Dish not found'
      }, 404);
    }
  }
}
