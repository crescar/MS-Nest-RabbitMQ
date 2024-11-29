import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StorageEntity } from '@app/common/entities/storage.entity';
import { ShoppingLogEntity } from '@app/common/entities/shoppingLog.entity';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StorageLogResponse, StorageResponse } from '@app/common/Dtos/storage/storageResponse.dto';
import { CreateStorageLogDto, UpdateStorageDto } from '@app/common/Dtos/orders/updateStorage.dto';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';

describe('StorageController', () => {
  let storageController: StorageController;

  const getStorageData = [
    {
      id: 1,
      name: 'test 1',
      quantity: 1
    }
  ]

  const getStorageResponse: StandartResponse<StandarPaginatedData<StorageResponse[]>> ={
    status: 'success',
    error: undefined,
    message: 'Get All Storage',
    data: {
      items: [
        {
          id: 1,
          name: 'test 1',
          quantity: 1
        }
      ],
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 1
    }
  }

  const getLogStorageData = [
    {
      id: 1,
      quantity: 1,
      createdAt: new Date('2024-11-12'),
      storage: {
        name: 'test 1',
      }
    }
  ]

  const getLogStorageResponse: StandartResponse<StandarPaginatedData<StorageLogResponse[]>> ={
    status: 'success',
    error: undefined,
    message: 'Shopping Logs',
    data: {
      items: [
        {
          id: 1,
          quantity: 1,
          createdAt: new Date('2024-11-12'),
          name: 'test 1'
        }
      ],
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 1
    }
  }

  const updateData: UpdateStorageDto[] = [
    {
      id: 1,
      quantity: 1
    }
  ]

  const updateResponse: StandartResponse<undefined> = {
    status: 'success',
    error: undefined,
    message: 'Element updates',
    data: undefined
  }

  const createLogData: CreateStorageLogDto[] = [
    {
      storageId: 1,
      quantity: 1,
    }
  ]

  const createLogResponse: StandartResponse<undefined> ={
    status: 'success',
    error: undefined,
    message: 'Shopping Log created',
    data: undefined
  }


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        StorageService,
        {
          provide: getRepositoryToken(StorageEntity),
          useValue: {
            count: jest.fn().mockReturnValue(1),
            find: jest.fn().mockReturnValue(getStorageData),
            update: jest.fn().mockReturnValue(undefined)
          }
        },
        {
          provide: getRepositoryToken(ShoppingLogEntity),
          useValue: {
            count: jest.fn().mockReturnValue(1),
            find: jest.fn().mockReturnValue(getLogStorageData),
            save: jest.fn().mockReturnValue(undefined)
          }
        }
      ],
    }).compile();

    storageController = app.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(storageController).toBeDefined();
  });

  it('should call storageService.send(get_storage) with the correct arguments', async () => {
    expect(await storageController.getStorage(new PaginateParamsDto())).toEqual(getStorageResponse);
  })

  it('should call storageService.send(get_shopping_logs) with the correct arguments', async () => {
    expect(await storageController.getShoppingLogs(new PaginateParamsDto())).toEqual(getLogStorageResponse);
  })

  it('should call storageService.send(update_storage) with the correct arguments', async () => {
    expect(await storageController.updateStorage(updateData)).toEqual(updateResponse);
  })

  it('should call storageService.send(create_shopping_log) with the correct arguments', async () => {
    expect(await storageController.createShoopingLog(createLogData)).toEqual(createLogResponse);
  })
});
