import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true, default: undefined })
  category?: number;

  @Column({ nullable: true, default: undefined })
  priority?: number;

  @Column({ nullable: true, default: undefined })
  date?: number;
}
