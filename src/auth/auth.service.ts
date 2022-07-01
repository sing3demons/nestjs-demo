import { Login } from './../login';
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

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.authRepository.findOneBy({ email });
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    console.log(`user: ${user.password}`);
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findOne({
      select: ['id', 'permission', 'password', 'fullname'],
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('not found user');
    }

    console.log(password);

    const isVerify = await argon.verify(user.password, password);
    if (!isVerify) {
      throw new UnauthorizedException('username or password invalid');
    }

    const token = await this.jwtService.signAsync(
      {
        user_id: user.id,
        permission: user.permission,
      },
      { secret: process.env.JWT_SECRET },
    );

    return { acces_token: token };
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
