import { createPromiseDialog } from "./createPromiseDialog";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
}

// Rendered by <ConfirmDialog />, mounted once in App.vue.
export const confirmDialog = createPromiseDialog<ConfirmOptions, true>();

// Returns a function that asks the user and resolves to true only if they
// confirm.
export function useConfirm() {
  return async (options: ConfirmOptions) =>
    (await confirmDialog.open(options)) === true;
}
