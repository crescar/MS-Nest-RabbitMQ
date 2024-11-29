import { Test, TestingModule } from '@nestjs/testing';
import { DishController } from './dish.controller';
import { ClientProxy } from '@nestjs/microservices';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { DishResponse } from '@app/common/Dtos/Dish/DishResponse.dto';
import { of } from 'rxjs';
import { microservicesDishConfiguration } from '@app/common/config/ms.config';

describe('DishController', () => {
  let controller: DishController;
  const response: StandartResponse<StandarPaginatedData<DishResponse[]>> ={
    status: 'success',
    error: undefined,
    message: 'success',
    data: {
      items: [
        {
          description: 'test',
          id: 1,
          name: 'test',
          ingredients: [
            {
              name: 'test',
              quantity: 1
            }
          ]
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
      controllers: [DishController],
      providers: [
        {
          provide: ClientProxy,
          useValue: {
            send: jest.fn()
          },
        },
        {
          provide: microservicesDishConfiguration.name,
          useValue: {
            send: jest.fn().mockReturnValue(of(response)),
          },
        }
      ],
    }).compile();
    controller = module.get<DishController>(DishController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call dishService.send with the correct arguments', async () => {
      expect(await controller.getStorage(1, 10, 'test')).toEqual(response)
  })

});
