import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { skip } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    try {
      const blog = new Blog();
      blog.title = createBlogDto.title;
      blog.description = createBlogDto.description;

      return await this.blogRepository.save(blog);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(page: number, limt: number) {
    return await this.blogRepository.findAndCount({
      skip: (page - 1) * limt,
      take: limt,
    });
  }

  async findOne(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    return await this.blogRepository.update(id, updateBlogDto);
  }

  async remove(id: number) {
    return await this.blogRepository.delete(id);
  }
}
