import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StorageController } from './controller/storage.controller';
import { microservicesStorageConfiguration } from '@app/common/config/ms.config';

@Module({
  controllers: [StorageController],
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule.forRoot()],
        name: microservicesStorageConfiguration.name,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${await configService.get('RABBITMQ_URL')}`],
            queue: microservicesStorageConfiguration.queue,
            queueOptions: {
              durable: microservicesStorageConfiguration.durable
            }
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ]
})
export class StorageModule {}
