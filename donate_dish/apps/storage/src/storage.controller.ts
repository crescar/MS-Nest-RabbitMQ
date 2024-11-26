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
}
