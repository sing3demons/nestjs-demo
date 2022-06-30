import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number, size: number): Promise<[User[], number]> {
    return await this.userRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const user = await this.findOne(id);

    return await this.userRepository.update(user.id, updateUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
