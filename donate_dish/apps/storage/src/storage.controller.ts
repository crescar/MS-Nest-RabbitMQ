import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { StorageService } from './storage.service';
import { CreateStorageLogDto, UpdateStorageDto } from '@app/common/Dtos/orders/updateStorage.dto';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { StorageLogResponse, StorageResponse } from '@app/common/Dtos/storage/storageResponse.dto';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';


@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @EventPattern(
    'update_storage'
  )
  async updateStorage(ingredients: UpdateStorageDto[]) {
    return await this.storageService.updateStorage(ingredients);
  }

  @EventPattern(
    'create_shopping_log'
  )
  async createShoopingLog(logs: CreateStorageLogDto[]){
    return await this.storageService.createShoopingLog(logs);
  }

  @EventPattern(
    'get_shopping_logs'
  )
  async getShoppingLogs(data: PaginateParamsDto):Promise<StandartResponse<StandarPaginatedData<StorageLogResponse[]>>>{
    return await this.storageService.getShoppingLogs(data);
  }

  @EventPattern('get_storage')
  async getStorage(data: PaginateParamsDto):Promise<StandartResponse<StandarPaginatedData<StorageResponse[]>>>{
    return await this.storageService.getStorage(data);
  }
}
