import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, Entity, JoinColumn, ManyToOne} from 'typeorm';
import { StorageEntity } from './storage.entity';

@Entity({
    name: 'shopping_logs',
  })
export class ShoppingLogEntity  {
    
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
        name: 'storage_id'
    })
    storageId: number;
  
    @Column()
    quantity: number;
  
    @CreateDateColumn({
      name: 'created_at',
    })
    createdAt: Date;

    @ManyToOne(() => StorageEntity, (storage) => storage.shoppingLogs)
    @JoinColumn({
      name: 'storage_id',
      referencedColumnName: 'id'
    })
    storage: StorageEntity;

}