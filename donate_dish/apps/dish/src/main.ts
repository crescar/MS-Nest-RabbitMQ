import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { microservicesDishConfiguration } from '@app/common/config/ms.config';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: microservicesDishConfiguration.queue,
        queueOptions: {
          durable: microservicesDishConfiguration.durable
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
