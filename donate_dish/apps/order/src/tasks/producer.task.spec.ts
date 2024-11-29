import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { TaskProducerBullQueue } from './producer.task';
import { KitchenDataDto } from '@app/common/Dtos/orders/kitchenData.dto'

describe('TaskProducer', () => {
  let producer: TaskProducerBullQueue
  let mockQueue: any;
  const kitchenData: KitchenDataDto = {
    dishId: 1,
    orderId: 1,
    ingredients: [
      {
        ingredientId: 1,
        name: 'test',
        needToBuy: false,
        quantityStorage: 5,
        quantityToPrepared: 1
      }
    ]
  }
  const job: jest.Mocked<Job> = {
    id: 'fakeJobId',
    data: kitchenData,
  } as jest.Mocked<Job>;
  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskProducerBullQueue,
        {
          provide: getQueueToken('kitchent-queue'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    producer = module.get<TaskProducerBullQueue>(TaskProducerBullQueue);
  });

  it('should be defined', () => {
    expect(producer).toBeDefined();
  });

  it('should work sendToKitchen', async () => {
    mockQueue.add.mockResolvedValue(job);
    const result = await producer.sendToKitchen(kitchenData);
    expect(mockQueue.add).toBeCalledWith('kitchent-queue', kitchenData);
    expect(result).toEqual(job);
  });

});