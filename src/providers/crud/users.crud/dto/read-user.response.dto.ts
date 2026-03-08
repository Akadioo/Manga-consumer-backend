import { User } from 'src/api/users/entities/user.entity';

export class ReadUserResponseDto {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  users: Partial<User>[];
}
