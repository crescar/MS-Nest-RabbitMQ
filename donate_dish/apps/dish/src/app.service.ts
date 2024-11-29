import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { DishEntity } from '../../../libs/common/src/entities/dish.entity';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { DishResponse } from '@app/common/Dtos/Dish/DishResponse.dto';



@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}
  async getRamdonDish(): Promise<StandartResponse<any>> {
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
      return {
        status: 'error',
        message: 'Dish not found',
        data: undefined,
        error: error?.message ?? 'Dish not found'
      }
    }
  }

  async getAllDishes(dataDto: PaginateParamsDto): Promise<StandartResponse<StandarPaginatedData<DishResponse[]>>>  {
    try {
      const totalItems = await this.dishRepository.count({
        where: {
          ...(dataDto.search ? {name: dataDto.search} : {})
        }
      })
      const page = dataDto.page ?? 1
      const limit = dataDto.limit ?? 10
      const totalPages = Math.ceil(totalItems / limit)

      const dishs = await this.dishRepository.find({
        take: limit,
        skip: (page - 1)* limit,
        order: {
          id: 'ASC',
        },
        where: {
          ...(dataDto.search ? {name: Like(`%${dataDto.search}%`)} : {})
        },
        relations: {
          ingredients: {
            storage: true
          }
        },
        select:{
          id: true,
          name: true,
          description: true,
          ingredients: {
            id: true,
            quantity: true,
            storage: {
              id: true,
              name: true,
              quantity: true
            }
          }
        }
      })

      const items = dishs.map(dish => {
        return {
          id: dish.id,
          name: dish.name,
          description: dish.description,
          ingredients: dish.ingredients.map((ingredient)=>{
            return {
              quantity: ingredient.quantity,
              name: ingredient.storage.name
            }
          })
        }
      } )


      return {
        status: 'success',
        message: 'Get All Dishes',
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
        message: 'Error to get Dish',
        data: undefined,
        error: error?.message ?? 'Error to get Dish'
      }
    }
  }
}
