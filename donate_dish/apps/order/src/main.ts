import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrderModule } from './order.module';
import { microservicesOrderConfiguration } from '@app/common/config/ms.config';



async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrderModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: microservicesOrderConfiguration.queue,
      queueOptions: {
        durable: microservicesOrderConfiguration.durable
      },
    },
  });
  await app.listen();
}
bootstrap();
