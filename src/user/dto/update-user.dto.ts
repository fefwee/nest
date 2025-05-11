import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserCredentialsDto {
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  newUsername?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, {
    message:
      'Password must contain at least 1 number, 1 uppercase and 1 lowercase letter',
  })
  newPassword?: string;
}
