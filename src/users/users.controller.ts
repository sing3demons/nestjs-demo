import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

type q = {
  page: any;
  page_size: any;
};

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query?: q) {
    let { page, page_size } = query;
    if (!page) {
      page = 1;
    }
    if (!page_size) {
      page_size = 12;
    }

    console.log(`page ${page}`);

    const [result, total] = await this.usersService.findAll(+page, +page_size);
    return {
      user: result,
      total: total,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateUserDto);
    if (result.affected === 0)
      throw new HttpException('invalid', HttpStatus.BAD_REQUEST);
    return {
      message: 'success.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(+id);
    if (result.affected === 0)
      throw new HttpException('invalid', HttpStatus.BAD_REQUEST);
    return {
      message: 'success.',
    };
  }
}
