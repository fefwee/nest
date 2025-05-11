import { IsString, IsBoolean } from 'class-validator';

export class CategoryDto {
  @IsString()
  color: string;

  @IsString()
  label: string;

  @IsBoolean()
  selected?: boolean;
}
