import { Blog } from 'src/blogs/entities/blog.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({
  name: 'user',
  // synchronize: false
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'member' })
  permission: string;

  //relation
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];
}
