import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from 'src/auth/admin-jwt-auth.guard';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryParam } from './query-param';

@Controller({ version: '1', path: 'blogs' })
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(AdminJwtAuthGuard)
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto, @Request() req: any) {
    return await this.blogsService.create(createBlogDto, req.user);
  }

  @Get()
  async findAll(@Query() query: QueryParam) {
    let { page, page_size } = query;
    if (!page) {
      page = 1;
    }
    if (!page_size) {
      page_size = 12;
    }
    const [result, total] = await this.blogsService.findAll(+page, +page_size);
    return {
      data: result,
      total: total,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(+id, updateBlogDto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.blogsService.remove(+id);
    if (result.affected === 0)
      throw new HttpException('invalid', HttpStatus.BAD_REQUEST);
    return {
      message: 'success.',
    };
  }
}
