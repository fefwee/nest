import {
  IsString,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  // Валидация для категории, если она указана
  @IsOptional()
  @IsInt()
  category?: number; // Например, 1 — работа, 2 — личные дела и т.д.

  // Валидация для приоритета, если он указан
  @IsOptional()
  @IsInt()
  priority?: number; // от 1 до 5

  // Валидация для даты, если она указана
  @IsOptional()
  @IsInt()
  @Min(1000000000) // минимальный timestamp (например, можно использовать стандартное значение)
  date?: number; // может быть представлено как Unix timestamp
}
