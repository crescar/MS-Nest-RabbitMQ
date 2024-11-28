import { Controller,  } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('get_random_dish')
  async getRamdonDish(): Promise<any> {
    const randomDish = await this.appService.getRamdonDish();
    return randomDish;
  }

  @EventPattern('get_all_dishes')
  async getAllDishes(data): Promise<any> {
    const dishes = await this.appService.getAllDishes(data);
    return dishes;
  }
}
