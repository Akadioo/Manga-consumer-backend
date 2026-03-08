import { Manga } from 'src/api/manga/entities/manga.entity';

export class ReadMangaResponseDto {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  mangas: Partial<Manga>[];
}
