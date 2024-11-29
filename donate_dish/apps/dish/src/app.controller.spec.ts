import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DishEntity } from '@app/common';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { DishResponse } from '@app/common/Dtos/Dish/DishResponse.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController', () => {
  let appController: AppController;

  const dataGetAll = [
    {
      id: 1,
      name: 'test 1',
      description: 'test 1',
      ingredients: [
        {
          id: 1,
          quantity: 1,
          storage: {
            id: 1,
            name: 'test 1',
            quantity: 1
          }
        }
      ]
    },
    {
      id: 2,
      name: 'test 2',
      description: 'test 2',
      ingredients: [
        {
          id: 1,
          quantity: 1,
          storage: {
            id: 1,
            name: 'test 1',
            quantity: 1
          }
        }
      ]
    }
  ]

  const getAllResponse: StandartResponse<StandarPaginatedData<DishResponse[]>> = {
    status: 'success',
    error: undefined,
    message: 'Get All Dishes',
    data: {
      items: [
        {
          description: 'test 1',
          id: 1,
          name: 'test 1',
          ingredients: [
            {
              name: 'test 1',
              quantity: 1
            }
          ]
        },
        {
          description: 'test 2',
          id: 2,
          name: 'test 2',
          ingredients: [
            {
              name: 'test 1',
              quantity: 1
            }
          ]
        }
      ],
      page: 1,
      limit: 10,
      totalPages: 1,
      totalItems: 2
    }
  }

  const dataRandomDish = new DishResponse()
  dataRandomDish.id = 1
  dataRandomDish.name = 'test 1'
  dataRandomDish.description = 'test 1'
  dataRandomDish.ingredients = [
    {
      name: 'test 1',
      quantity: 1,
    }
  ]

  const randomDishResponse: StandartResponse<any> = {
    status: 'success',
    error: undefined,
    message: 'Dish found',
    data: dataRandomDish
  }


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(DishEntity),
          useValue: {
            count: jest.fn().mockReturnValue(2),
            findOneOrFail: jest.fn().mockReturnValue(dataRandomDish),
            find: jest.fn().mockReturnValue(dataGetAll),
          }
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should call dishService.send(get_all_dishes) with the correct arguments', async () => {
    expect(await appController.getAllDishes(new PaginateParamsDto())).toEqual(getAllResponse);
  } )

  it('should call dishService.send(get_random_dish) with the correct arguments', async () => {
    expect(await appController.getRamdonDish()).toEqual(randomDishResponse);
  } )

});
