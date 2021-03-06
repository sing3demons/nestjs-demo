import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.authRepository.findOne({
      select: ['id', 'permission', 'password', 'fullname'],
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('not found user');
    }

    const isVerify = await argon.verify(user.password, password);
    if (!isVerify) {
      throw new UnauthorizedException('username or password invalid');
    }

    const token = await this.jwtService.signAsync(
      { sub: user.id },
      { secret: process.env.JWT_SECRET },
    );

    return { token: token };
  }

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
