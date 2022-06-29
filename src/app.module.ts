import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'p@ssw0rd',
      database: 'nestjs',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
