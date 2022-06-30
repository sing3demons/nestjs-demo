import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      user.email = createUserDto.email;
      user.fullname = createUserDto.fullname;
      user.password = await argon.hash(createUserDto.password);

      return await this.authRepository.save(user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new HttpException('conflict', HttpStatus.CONFLICT);
      }
    }
  }
}
