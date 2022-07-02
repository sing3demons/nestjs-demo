import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import * as path from 'path';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { promisify } from 'util';
import { promises, writeFile, existsSync } from 'fs';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto, user: User) {
    try {
      const blog = new Blog();
      blog.title = createBlogDto.title;
      blog.description = createBlogDto.description;
      blog.user = user;
      console.log(blog.user);

      blog.photo = await this.saveImageToDisk(createBlogDto.photo);

      // return await this.blogRepository.save(blog);
      await this.blogRepository.save(blog);
      return {
        photo: blog.photo,
        message: 'เพิ่ม blog และอัปโหลดไฟล์เรียบร้อย',
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(page: number, limt: number) {
    return await this.blogRepository.findAndCount({
      skip: (page - 1) * limt,
      take: limt,
      relations: ['user'],
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

  async saveImageToDisk(baseImage: any) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./');

    //โฟลเดอร์และ path ของการอัปโหลด
    const uploadPath = `${projectPath}/public/images/`;
    if (existsSync(uploadPath)) {
      console.log('Directory exists!');
    } else {
      await promises.mkdir(uploadPath, { recursive: true });
    }

    //หานามสกุลไฟล์
    const ext = baseImage.substring(
      baseImage.indexOf('/') + 1,
      baseImage.indexOf(';base64'),
    );

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
      filename = `${v4()}.svg`;
    } else {
      filename = `${v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    const imgData = this.decodeBase64Image(baseImage);
    // console.log(imgData);

    //เขียนไฟล์ไปไว้ที่ path
    const writeFileAsync = promisify(writeFile);
    await writeFileAsync(uploadPath + filename, imgData, 'base64');
    //return ชื่อไฟล์ใหม่ออกไป
    return filename;
  }

  decodeBase64Image(base64Str: string) {
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    return matches[2];
  }
}
