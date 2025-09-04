export interface Book {
  id: number;
  title: string;
  file: string;
  created_at: string;
}

export interface BookDetail extends Book {
  bookmark_cfi: string | null;
}
