import { BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DishEntity } from './dish.entity';
import { StorageEntity } from './storage.entity';

@Entity({
  name: 'dish_ingredient',
})
export class DishIngredientsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dish_id: number;

  @Column({
    name: 'ingredient_id',
  })
  ingredient_id:number;

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

  @ManyToOne(() => DishEntity, (dish) => dish.ingredients)
  @JoinColumn({
    name: 'dish_id',
    referencedColumnName: 'id'
  })
  dish: DishEntity;

  @OneToOne(() => StorageEntity)
  @JoinColumn({
    name: 'ingredient_id',
    referencedColumnName: 'id'
  })
  storage: StorageEntity;
}