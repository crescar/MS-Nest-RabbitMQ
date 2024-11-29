import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { ClientProxy } from '@nestjs/microservices';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { StorageLogResponse, StorageResponse } from '@app/common/Dtos/storage/storageResponse.dto';
import { microservicesStorageConfiguration } from '@app/common/config/ms.config';
import { of } from 'rxjs';


describe('StorageController', () => {
  let controller: StorageController;

  const reponseGetStorage: StandartResponse<StandarPaginatedData<StorageResponse[]>> = {
    status: 'success',
    error: undefined,
    message: 'success',
    data: {
      items: [
        {
          id: 1,
          name: 'tomatoe',
          quantity: 10,
        }
      ],
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 1
    }
  }

  const reponseGetShoppingLogs: StandartResponse<StandarPaginatedData<StorageLogResponse[]>> = {
    status: 'success',
    error: undefined,
    message: 'success',
    data: {
      items:[
        {
          id: 1,
          name: 'tomatoe',
          quantity: 10,
          createdAt: new Date()
        }
      ],
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 1
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        {
          provide: ClientProxy,
          useValue: {
            send: jest.fn()
          }
        },
        {
          provide: microservicesStorageConfiguration.name,
          useValue: {
            send: jest.fn().mockImplementation((...args) => {
              switch (args[0]) {
                case 'get_storage':
                  return of(reponseGetStorage);
                case 'get_shopping_logs':
                  return of(reponseGetShoppingLogs);
                default:
                  return of();
              }
            }),
          },
        }
      ],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call storageService.send(get_storage) with the correct arguments', async () => { 
    expect(await controller.getStorage(1, 10, 'test')).toEqual(reponseGetStorage)
  })

  it('should call storageService.send(get_shopping_logs) with the correct arguments', async () => { 
    expect(await controller.shoppingLogs(1, 10 )).toEqual(reponseGetShoppingLogs)
  })


});
