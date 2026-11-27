import { createPromiseDialog } from "./createPromiseDialog";

export interface PromptOptions {
  title: string;
  label: string;
  text?: string;
  required?: boolean;
  confirmLabel?: string;
}

// Rendered by <PromptDialog />, mounted once in App.vue.
export const promptDialog = createPromiseDialog<PromptOptions, string>();

// Returns a function that asks the user for a text and resolves to it, or to
// null if they cancel.
export function usePrompt() {
  return promptDialog.open;
}
