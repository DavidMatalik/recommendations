import { createPromiseDialog } from "@/composables/createPromiseDialog";
import type { Book } from "./types";

// Rendered by <AddBookDialog />, mounted on the favorite books page.
export const addBookDialog = createPromiseDialog<Record<string, never>, Book>();

// Returns a function that opens the dialog and resolves to the added book, or
// null if cancelled.
export function useAddBookDialog() {
  return () => addBookDialog.open({});
}
