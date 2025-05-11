import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';
import * as process from 'node:process';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth-module';

@Module({
  imports: [
    CategoryModule,
    TodoModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost', // дефолтное значение
      port: parseInt(process.env.DB_PORT, 10) || 5432, // дефолтное значение
      username: process.env.DB_USERNAME || 'nestuser', // дефолтное значение
      password: process.env.DB_PASSWORD || 'nestpass', // дефолтное значение
      database: process.env.DB_NAME || 'nestdb', // дефолтное значение
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development', // отключить синхронизацию в продакшн
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
