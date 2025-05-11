import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserCredentialsDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.gurd';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }

  @Put('me/credentials')
  @UseGuards(JwtAuthGuard)
  async updateCredentials(
    @Request() req,
    @Body() updateUserCredentialsDto: UpdateUserCredentialsDto,
  ) {
    return this.userService.updateUserCredentials(
      req.user.userId, // ID из JWT токена
      updateUserCredentialsDto.currentPassword,
      {
        newUsername: updateUserCredentialsDto.newUsername,
        newPassword: updateUserCredentialsDto.newPassword,
      },
    );
  }
}
