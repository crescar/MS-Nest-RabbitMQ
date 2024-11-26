import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CommonModule, OrderStatusEntity } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '@app/common/entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bullmq';
import { TaskProducerBullQueue } from './tasks/producer.task';
import { TaskConsumerBullQueue } from './tasks/consumer.task';
import { microservicesDishConfiguration, microservicesStorageConfiguration } from '@app/common/config/ms.config';


@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderStatusEntity
    ]),
    ClientsModule.register([
      {
        name: microservicesDishConfiguration.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: microservicesDishConfiguration.queue,
          queueOptions: {
            durable: microservicesDishConfiguration.durable
          }
        }
      },
      {
        name: microservicesStorageConfiguration.name,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: microservicesStorageConfiguration.queue,
          queueOptions: {
            durable: microservicesStorageConfiguration.durable
          }
        }
      }
    ]),
    BullModule.forRoot(
      {
        connection: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        },
      },
    ),
    BullModule.registerQueue({
      name: 'kitchent-queue',
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, TaskProducerBullQueue, TaskConsumerBullQueue],
})
export class OrderModule {}
