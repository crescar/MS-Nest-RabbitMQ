import { BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Entity, ManyToOne } from 'typeorm';
import { DishEntity } from './dish.entity';
import { OrderStatusEntity } from './orderStatus.entity';




@Entity({
  name: 'order',
})
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'dish_id',
  })
  dishId: number;

  @Column({
    name: 'status_id',
  })
  statusId:number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToOne(() => DishEntity)
  @JoinColumn({
    name: 'dish_id',
    referencedColumnName: 'id'
  })
  dish: DishEntity

  @OneToOne(() => OrderStatusEntity)
  @JoinColumn({
    name: 'status_id',
    referencedColumnName: 'id'
  })
  status: OrderStatusEntity

}