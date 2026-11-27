export interface Book {
  id: number;
  title: string;
  author: string;
  status: "favorite" | "recommended" | "not_interested" | null;
  freeText: string | null;
  aiSummary: string | null;
}
