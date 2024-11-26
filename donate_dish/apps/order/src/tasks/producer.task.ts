import { KitchenDataDto } from '@app/common/Dtos/orders/kitchenData.dto'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Job, Queue } from 'bullmq'

@Injectable()
export class TaskProducerBullQueue {
  constructor(
    @InjectQueue('kitchent-queue')
    private readonly navitaireQueue: Queue
  ) {}

  async sendToKitchen(kitchentData: KitchenDataDto): Promise<Job<KitchenDataDto>> | null {
    try {
      const job = await this.navitaireQueue.add(
        'kitchent-queue',
        kitchentData
      )
      return job
    } catch (error) {
      return null
    }
  }
}
