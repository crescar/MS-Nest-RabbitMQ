import { UpdateStorageDto } from '@app/common/Dtos/orders/updateStorage.dto';
import { StorageEntity } from '@app/common/entities/storage.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(StorageEntity)
    private readonly StorageRepository: Repository<StorageEntity>,
  ) {}


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
      throw new HttpException({
        status: 'error',
        message: 'Error to update Ingredients',
        data: undefined,
        error: error?.message ?? 'Error to update Ingredients'
      }, 404);
    }

  }

}
