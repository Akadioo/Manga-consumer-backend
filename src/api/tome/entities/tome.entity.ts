export class Tome {
  id?: string;
  volumen: number;
  isbn: string;
  type: string;
  ean?: string;
  price: number;
  stock: number;
  image_tomo_url: string;
  book_series_id: string;
  quantityOnHand?: number;
}
