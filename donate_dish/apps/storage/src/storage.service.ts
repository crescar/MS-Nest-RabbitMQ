import { UpdateStorageDto } from '@app/common/Dtos/orders/updateStorage.dto';
import { ShoppingLogEntity } from '@app/common/entities/shoppingLog.entity';
import { StorageEntity } from '@app/common/entities/storage.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';


@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(StorageEntity)
    private readonly StorageRepository: Repository<StorageEntity>,
    @InjectRepository(ShoppingLogEntity)
    private readonly ShoppingLogRepository: Repository<ShoppingLogEntity>
  ) {}

  async getStorage(dataDto:any){
    try {
      const totalItems = await this.StorageRepository.count({
        where: {
          ...(dataDto.search ? {name: Like(`%${dataDto.search}`)} : {})
        }
      })
      const page = dataDto.page ?? 1
      const limit = dataDto.limit ?? 10
      const totalPages = Math.ceil(totalItems / limit)

      const items = await this.StorageRepository.find({
        take: limit,
        skip: (page - 1)* limit,
        order: {
          id: 'ASC',
        },
        where: {
          ...(dataDto.search ? {name: dataDto.search} : {})
        },
        select: {
          id: true,
          name: true,
          quantity: true
        }
      })

      return {
        status: 'success',
        message: 'Shopping Logs',
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
        message: 'Error to get Storage',
        data: undefined,
        error: error?.message ?? 'Error to get Storage'
      }
    }
  }

  async updateStorage(ingredients: UpdateStorageDto[]) {
    try {
      for (let index = 0; index < ingredients.length; index++) {
        const ingredient = ingredients[index];
        await this.StorageRepository.update(ingredient.id, {
          quantity: ingredient.quantity
        })
      }
      return {
        status: 'success',
        message: 'Element updates',
        data: undefined,
        error: undefined
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Error to update Ingredients',
        data: undefined,
        error: error?.message ?? 'Error to update Ingredients'
      }
    }

  }

  async createShoopingLog(logs: any[]){
    try {
      
      await this.ShoppingLogRepository.save(logs)
      return {
        status: 'success',
        message: 'Shopping Log created',
        data: undefined,
        error: undefined
      }

    } catch (error) {
      return {
        status: 'error',
        message: 'Error create Shopping Log',
        data: undefined,
        error: error?.message ?? 'Error to create Shopping Log'
      }
    }
  }

  async getShoppingLogs(dataDto: any){
    try {

      const totalItems = await this.ShoppingLogRepository.count()
      const page = dataDto.page ?? 1
      const limit = dataDto.limit ?? 10
      const totalPages = Math.ceil(totalItems / limit)

      const logs = await this.ShoppingLogRepository.find(
        {
          take: limit,
          skip: (page - 1)* limit,
          order: {
            id: 'ASC'
          },
          relations: {
            storage: true
          },
          select:{
            id: true,
            quantity: true,
            createdAt: true,
            storage: {
              name: true,
            }
          }
        }
      )
      const items = logs.map((log)=>{
        return {
          id: log.id,
          quantity: log.quantity,
          createdAt: log.createdAt,
          name: log.storage.name
        }
      })
      return {
        status: 'success',
        message: 'Shopping Logs',
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
        message: 'Error to get Shopping Logs',
        data: undefined,
        error: error?.message ?? 'Error to get Shopping Logs'
      }
    }
  }

}
