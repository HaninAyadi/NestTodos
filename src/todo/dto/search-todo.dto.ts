import { TodoStatusEnum } from '../enums/todo-status.enum';
import { IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SearchTodoDto {

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsIn([
    TodoStatusEnum.waiting,
    TodoStatusEnum.done,
    TodoStatusEnum.actif,
  ], {
    message: `The status is invalid`
  })
  @IsOptional()
  status: TodoStatusEnum;
}
