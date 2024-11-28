import { Module } from '@nestjs/common';
import { DishController } from './controller/dish.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microservicesDishConfiguration } from '@app/common/config/ms.config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule.forRoot()],
        name: microservicesDishConfiguration.name,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${await configService.get('RABBITMQ_URL')}`],
            queue: microservicesDishConfiguration.queue,
            queueOptions: {
              durable: microservicesDishConfiguration.durable
            }
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DishController]
})
export class DishModule {}
