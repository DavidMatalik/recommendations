<script setup lang="ts">
import { useTemplateRef } from "vue";
import { confirmDialog } from "@/composables/useConfirm";

const { options, settle, bind } = confirmDialog;
const dialog = useTemplateRef("dialog");
bind(dialog);

// <form method="dialog"> sets returnValue to the clicked button's value;
// Esc and backdrop clicks leave it empty, which counts as "cancel".
function onClose() {
  settle(dialog.value?.returnValue === "confirm" ? true : null);
  if (dialog.value) dialog.value.returnValue = "";
}

// closedby="any" isn't supported everywhere yet: a click on the dialog
// element itself (not its content) is a click on the backdrop.
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close();
}
</script>

<template>
  <dialog
    ref="dialog"
    closedby="any"
    aria-labelledby="confirm-heading"
    aria-describedby="confirm-message"
    class="m-auto w-full max-w-sm rounded-2xl bg-surface text-ink shadow-soft backdrop:bg-black/40"
    @click="onDialogClick"
    @close="onClose"
  >
    <form method="dialog" class="flex flex-col gap-3 p-6">
      <h2 id="confirm-heading" class="font-serif text-xl font-semibold">
        {{ options?.title }}
      </h2>
      <p id="confirm-message" class="text-muted">{{ options?.message }}</p>
      <div class="mt-3 flex justify-end gap-2">
        <button
          value="cancel"
          autofocus
          class="cursor-pointer rounded-full px-5 py-2 font-medium text-muted transition hover:bg-canvas hover:text-ink"
        >
          Abbrechen
        </button>
        <button
          value="confirm"
          class="cursor-pointer rounded-full bg-danger px-5 py-2 font-semibold text-white transition hover:opacity-90"
        >
          {{ options?.confirmLabel ?? "Bestätigen" }}
        </button>
      </div>
    </form>
  </dialog>
</template>
