import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './controller/order.controller';
import { microservicesOrderConfiguration } from '@app/common/config/ms.config';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  controllers: [OrderController],
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule.forRoot()],
        name: microservicesOrderConfiguration.name,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${await configService.get('RABBITMQ_URL')}`],
            queue: microservicesOrderConfiguration.queue,
            queueOptions: {
              durable: microservicesOrderConfiguration.durable
            }
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ]
})
export class OrderModule {}
