import { createPromiseDialog } from "@/composables/createPromiseDialog";
import type { Book } from "./types";

// Rendered by <BookDialog />, mounted on the favorite books page.
export const bookDialog = createPromiseDialog<{ book?: Book }, Book>();

// Returns a function that opens the dialog to edit the given book, or to add
// a new one, and resolves to the saved book, or null if cancelled.
export function useBookDialog() {
  return (book?: Book) => bookDialog.open({ book });
}
