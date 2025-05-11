import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: string;

  @Column()
  label: string;

  @Column()
  selected: boolean;
}
