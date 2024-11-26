import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '../../../libs/common/src/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from '@app/common/entities/dish.entity';
import { DishIngredientsEntity } from '@app/common/entities/dishIngredients.entity';



@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      DishEntity,
      DishIngredientsEntity
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
