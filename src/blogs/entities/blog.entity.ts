import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'desc' })
  description: string;

  @Column({ default: 'nopic.png' })
  photo: string;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;
}
