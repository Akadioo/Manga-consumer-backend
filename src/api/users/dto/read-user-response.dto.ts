import { User } from '../entities/user.entity';

export class ReadUserResponseDto {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  users: Partial<User>[];
}
