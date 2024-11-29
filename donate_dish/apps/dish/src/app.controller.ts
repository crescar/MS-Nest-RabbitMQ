import { Controller,  } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';
import { StandartResponse } from '@app/common/Dtos/standartResponse.dto';
import { StandarPaginatedData } from '@app/common/Dtos/StandarPaginateData.dto';
import { DishResponse } from '@app/common/Dtos/Dish/DishResponse.dto';
import { PaginateParamsDto } from '@app/common/Dtos/PaginateParams.dto';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('get_random_dish')
  async getRamdonDish(): Promise<StandartResponse<any>> {
    const randomDish = await this.appService.getRamdonDish();
    return randomDish;
  }

  @EventPattern('get_all_dishes')
  async getAllDishes(data: PaginateParamsDto): Promise<StandartResponse<StandarPaginatedData<DishResponse[]>>> {
    const dishes = await this.appService.getAllDishes(data);
    return dishes;
  }
}
