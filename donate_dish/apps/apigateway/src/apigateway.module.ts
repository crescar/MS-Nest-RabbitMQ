import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { StorageModule } from './storage/storage.module';
import { DishModule } from './dish/dish.module';

@Module({
  imports: [
    OrderModule,
    StorageModule,
    DishModule,
  ],
  controllers: [],
  providers: [],
})
export class ApigatewayModule {}
