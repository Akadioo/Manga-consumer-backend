import { Editorial } from 'src/api/editorial/entities/editorial.entity';

export class ReadEditorialResponseDto {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  editorials: Partial<Editorial>[];
}
