import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { Job } from 'bullmq'
import { firstValueFrom } from 'rxjs';
import { OrderService } from '../order.service';
import { microservicesStorageConfiguration } from '@app/common/config/ms.config';
import { KitchenDataDto } from '@app/common/Dtos/orders/kitchenData.dto';


@Processor('kitchent-queue')
export class TaskConsumerBullQueue extends WorkerHost {
  @Inject(microservicesStorageConfiguration.name) private readonly storageService: ClientProxy
  private readonly orderService: OrderService

  constructor(orderService: OrderService) {
    super()
    this.orderService = orderService
  }

  async process(job: Job<KitchenDataDto>) {
    this.processToKitchen(job.data)
  }

  async processToKitchen(data: KitchenDataDto) {
    const getIngredientsToBuy = data.ingredients.filter((ingredient)=>ingredient.needToBuy)
    if(getIngredientsToBuy) {
      const updateStorage = []
      const logStorage = []
      for (let index = 0; index < getIngredientsToBuy.length; index++) {
        const ingredient = getIngredientsToBuy[index];
        let buy = 0
        while (ingredient.quantityToPrepared > buy) {
          buy += await this.buyIngredients(ingredient.name)
        }
        updateStorage.push({
          id: ingredient.ingredientId,
          quantity: buy + ingredient.quantityStorage
        }) 
        logStorage.push({
          storageId: ingredient.ingredientId,
          quantity: buy
        })
        
        ingredient.quantityStorage += buy
      } 
      await firstValueFrom(this.storageService.emit('update_storage',updateStorage))
      await firstValueFrom(this.storageService.emit('create_shopping_log',logStorage))
    }
    const dataUpdateStorage = data.ingredients.map((ingredient)=>{
      return {
        id: ingredient.ingredientId,
        quantity: ingredient.quantityStorage - ingredient.quantityToPrepared
      }
    })
    await firstValueFrom(this.storageService.emit('update_storage',dataUpdateStorage)) 
    await this.orderService.updateOrder({
      id: data.orderId,
      statusId: 2
    })
  }
  
  async buyIngredients(name:string) {
    try {
      const {data} = await axios.get(`${process.env.GROCERY_STORE_API}?ingredient=${name}`)
      return data.quantitySold 
    } catch (error) {
      return 0
    }
  }
  
}
