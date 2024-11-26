import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from './entities/dish.entity';
import { DishIngredientsEntity } from './entities/dishIngredients.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderStatusEntity } from './entities/orderStatus.entity';
import { StorageEntity } from './entities/storage.entity';

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true
    }
  ),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.PSQL_HOST,
    port: +process.env.PSQL_PORT,
    password: process.env.PSQL_PASS,
    username: process.env.PSQL_USER,
    database: process.env.PSQL_DB,
    schema: process.env.PSQL_SCHEMA,
    synchronize: false,
    entities: [
      DishEntity,
      DishIngredientsEntity,
      OrderEntity,
      OrderStatusEntity,
      StorageEntity
    ]
  })
],
  providers: [],
  exports: [],
})
export class CommonModule {}
