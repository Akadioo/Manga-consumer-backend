import { Tome } from 'src/api/tome/entities/tome.entity';

export class ReadTomeResponseDto {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  users: Partial<Tome>[];
}
