import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, Entity, JoinColumn, OneToMany} from 'typeorm';
import { ShoppingLogEntity } from './shoppingLog.entity';

@Entity({
    name: 'storage',
  })
  export class StorageEntity  {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    quantity: number;
  
    @CreateDateColumn({
      name: 'created_at',
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      name: 'updated_at',
    })
    updatedAt: Date;

    @OneToMany(() => ShoppingLogEntity, (shoppingLog) => shoppingLog.storage)
    shoppingLogs: ShoppingLogEntity[];
    
  }