import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { StorageService } from './storage.service';
import { UpdateStorageDto } from '@app/common/Dtos/orders/updateStorage.dto';


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
  async createShoopingLog(logs: any[]){
    return await this.storageService.createShoopingLog(logs);
  }

  @EventPattern(
    'get_shopping_logs'
  )
  async getShoppingLogs(data: any){
    return await this.storageService.getShoppingLogs(data);
  }

  @EventPattern('get_storage')
  async getStorage(data: any){
    return await this.storageService.getStorage(data);
  }
}
