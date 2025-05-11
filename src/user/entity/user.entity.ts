import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, {
    message:
      'Password must contain at least 1 number, 1 uppercase and 1 lowercase letter',
  })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Хешируем только если пароль был изменён
    if (
      this.password &&
      !this.password.startsWith('$2a$') &&
      !this.password.startsWith('$2b$')
    ) {
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      } catch (error) {
        console.error('Hashing error:', error);
        throw new Error('Password hashing failed');
      }
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    if (!this.password || !attempt) {
      return false;
    }

    try {
      const isMatch = await bcrypt.compare(attempt, this.password);
      console.log(`Password comparison for ${this.username}:`, {
        attempt,
        storedHash: this.password,
        isMatch,
      });
      return isMatch;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
}
