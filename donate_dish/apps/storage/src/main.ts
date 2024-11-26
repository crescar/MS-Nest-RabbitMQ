import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { StorageModule } from './storage.module';
import { microservicesStorageConfiguration } from '@app/common/config/ms.config';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StorageModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: microservicesStorageConfiguration.queue,
        queueOptions: {
          durable: microservicesStorageConfiguration.durable
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
