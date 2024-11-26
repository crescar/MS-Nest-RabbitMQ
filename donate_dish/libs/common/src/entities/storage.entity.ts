import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, Entity, JoinColumn} from 'typeorm';
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
    
  }