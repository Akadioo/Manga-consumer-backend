import { Manga } from 'src/api/manga/entities/manga.entity';

export class Editorial {
  id: string;

  name: string;

  website?: string;

  country?: string;

  phone?: string;

  contact_email?: string;

  mangas: Manga[];
}
