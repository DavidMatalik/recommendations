<script setup lang="ts">
import { ref, useTemplateRef, watch } from "vue";
import { promptDialog } from "@/composables/usePrompt";

const { options, settle, bind } = promptDialog;
const dialog = useTemplateRef("dialog");
const text = ref("");

// Prefills the text on open. Registered before bind() so the textarea is
// ready when the dialog shows.
watch(options, (current) => {
  if (current) text.value = current.text ?? "";
});
bind(dialog);

function submit() {
  settle(text.value.trim());
}

// Esc, backdrop and cancel all end here; after a submit it's a no-op.
function onClose() {
  settle(null);
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
    aria-labelledby="prompt-dialog-heading"
    class="m-auto w-full max-w-lg rounded-2xl bg-surface text-ink shadow-soft backdrop:bg-black/40"
    @click="onDialogClick"
    @close="onClose"
  >
    <form class="flex flex-col gap-4 p-6" @submit.prevent="submit">
      <h2 id="prompt-dialog-heading" class="font-serif text-2xl font-semibold">
        {{ options?.title }}
      </h2>
      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium">{{ options?.label }}</span>
        <textarea
          v-model="text"
          :required="options?.required"
          rows="5"
          autofocus
          class="rounded-lg border border-line bg-canvas px-3 py-2 outline-accent"
        />
      </label>
      <div class="mt-2 flex justify-end gap-2">
        <button
          type="button"
          class="cursor-pointer rounded-full px-5 py-2 font-medium text-muted transition hover:bg-canvas hover:text-ink"
          @click="dialog?.close()"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          class="cursor-pointer rounded-full bg-accent px-5 py-2 font-semibold text-white transition hover:bg-accent-hover"
        >
          {{ options?.confirmLabel ?? "Speichern" }}
        </button>
      </div>
    </form>
  </dialog>
</template>
