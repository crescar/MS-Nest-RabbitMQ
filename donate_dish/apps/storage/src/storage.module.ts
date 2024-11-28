import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { CommonModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageEntity } from '@app/common/entities/storage.entity';
import { ShoppingLogEntity } from '@app/common/entities/shoppingLog.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([
      StorageEntity,
      ShoppingLogEntity
    ])
  ],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
