import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { KitchenDataDto } from '@app/common/Dtos/orders/kitchenData.dto'
import { TaskConsumerBullQueue } from './consumer.task';
import { ClientProxy } from '@nestjs/microservices';
import { microservicesStorageConfiguration } from '../../../../libs/common/src/config/ms.config';
import { of } from 'rxjs';
import axios from 'axios'
import { OrderService } from '../order.service';
jest.mock('axios')

describe('TaskConsumer', () => {
  let consumer: TaskConsumerBullQueue
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
      },
      {
        ingredientId: 2,
        name: 'test 2',
        needToBuy: true,
        quantityStorage: 0,
        quantityToPrepared: 1
      }
    ]
  }
  axios.get = jest.fn().mockResolvedValue( { data: { quantity: 1 } })
  const job: jest.Mocked<Job> = {
    id: 'fakeJobId',
    data: kitchenData,
  } as jest.Mocked<Job>;
  beforeEach(async () => {
    mockQueue = {
      process: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskConsumerBullQueue,
        {
          provide: getQueueToken('kitchent-queue'),
          useValue: mockQueue,
        },
        {
          provide: ClientProxy,
          useValue: {
            emit: jest.fn()
          }
        },
        {
          provide: microservicesStorageConfiguration.name,
          useValue: {
            emit: jest.fn().mockImplementation((...args) => {
              switch (args[0]) {
                case 'update_storage':
                  return of({});
                case 'create_shopping_log':
                  return of({});
                default:
                  return of();
              }
            }),
          },
        },
        {
          provide: OrderService,
          useValue: {
            updateOrder: jest.fn()
          }
        }
      ],
    }).compile();

    consumer = module.get<TaskConsumerBullQueue>(TaskConsumerBullQueue);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should process job', async () => {
    try {
      await consumer.process(job)
    } catch (error) {
      console.log(error)
    }
  });


});