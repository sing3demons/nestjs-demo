import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update(+id, updateUserDto);
    if (result.affected === 0)
      throw new HttpException('invalid', HttpStatus.BAD_REQUEST);
    return {
      message: 'success.',
    };
  }

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
