import { Editorial } from 'src/api/editorial/entities/editorial.entity';

export class Manga {
  id: string;

  name: string;

  author: string;

  genre: string;

  image_url?: string;

  issn?: string;

  editorial: Editorial;
}
