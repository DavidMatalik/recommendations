import { shallowRef, watch, type ShallowRef } from "vue";

// Shared state for a dialog that is mounted once and opened from anywhere:
// open() shows it and resolves when it closes, with the result, or null if
// it was cancelled.
export function createPromiseDialog<Options, Result>() {
  // The options of the current request; null while the dialog is closed.
  const options = shallowRef<Options | null>(null);
  let resolve: ((result: Result | null) => void) | null = null;

  function open(next: Options): Promise<Result | null> {
    resolve?.(null);
    options.value = next;
    return new Promise((r) => (resolve = r));
  }

  // Called by the dialog component when it closes; later calls are no-ops.
  function settle(result: Result | null) {
    resolve?.(result);
    resolve = null;
    options.value = null;
  }

  // Called in the dialog component's setup: shows and hides its <dialog>
  // element to match the state.
  function bind(dialog: Readonly<ShallowRef<HTMLDialogElement | null>>) {
    watch(options, (current) => {
      const el = dialog.value;
      if (current && el && !el.open) el.showModal();
      else if (!current && el?.open) el.close();
    });
  }

  return { options, open, settle, bind };
}
