import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Entity, JoinColumn} from 'typeorm';
import { DishIngredientsEntity } from './dishIngredients.entity';

@Entity({
  name: 'dish',
})
export class DishEntity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => DishIngredientsEntity, (dishIngredients) => dishIngredients.dish)
  ingredients: DishIngredientsEntity[];

}