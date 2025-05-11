import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  // Получить всех пользователей (для админа)
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Получить пользователя по ID
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserCredentials(
    userId: number,
    currentPassword: string,
    updates: {
      newUsername?: string;
      newPassword?: string;
    },
  ): Promise<User> {
    // 1. Проверяем наличие изменений
    if (!updates.newUsername && !updates.newPassword) {
      throw new BadRequestException('No updates provided');
    }

    // 2. Получаем пользователя (с паролем)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'password'],
    });
    if (!user) throw new NotFoundException('User not found');

    // 3. Проверяем текущий пароль
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    // 4. Обновляем username (если нужно)
    if (updates.newUsername && updates.newUsername !== user.username) {
      const usernameExists = await this.userRepository.findOneBy({
        username: updates.newUsername,
      });
      if (usernameExists) throw new ConflictException('Username already taken');
      user.username = updates.newUsername;
    }

    // 5. Обновляем password (если нужно)
    if (updates.newPassword) {
      user.password = updates.newPassword; // Автоматически хешируется в @BeforeUpdate()
    }

    // 6. Сохраняем ТОЛЬКО если были изменения
    if (updates.newUsername || updates.newPassword) {
      return this.userRepository.save(user);
    }

    return user;
  }

  // Удалить пользователя
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }
}
