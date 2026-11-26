<script setup lang="ts">
import { X } from "@lucide/vue";
import { computed, reactive, ref, useTemplateRef, watch } from "vue";
import { apiUrl } from "@/api";
import { bookDialog } from "./useBookDialog";

const { options, settle, bind } = bookDialog;
const dialog = useTemplateRef("dialog");
const form = reactive({ title: "", author: "", freeText: "" });
// The book being edited; null means a new book is added.
const editing = computed(() => options.value?.book ?? null);
const saving = ref(false);
const error = ref<string | null>(null);

// Fills the form on open: with the edited book, or empty for a new one.
// Registered before bind() so the form is ready when the dialog shows.
watch(options, (current) => {
  if (!current) return;
  const { book } = current;
  Object.assign(form, {
    title: book?.title ?? "",
    author: book?.author ?? "",
    freeText: book?.freeText ?? "",
  });
  error.value = null;
});
bind(dialog);

function close() {
  dialog.value?.close();
}

// Runs on every close (button, Esc, backdrop); after a save it's a no-op.
function onClose() {
  settle(null);
}

// closedby="any" isn't supported everywhere yet: a click on the dialog
// element itself (not its content) is a click on the backdrop.
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) close();
}

async function submit() {
  saving.value = true;
  error.value = null;
  try {
    const book = editing.value;
    const fields = {
      title: form.title,
      author: form.author,
      freeText: form.freeText || null,
    };
    const res = await fetch(
      book ? `${apiUrl}/books/${book.id}` : `${apiUrl}/books`,
      {
        method: book ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book ? fields : { ...fields, status: "favorite" }),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    settle(await res.json());
  } catch (e) {
    error.value = `Speichern fehlgeschlagen (${(e as Error).message})`;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <dialog
    ref="dialog"
    closedby="any"
    aria-labelledby="book-dialog-heading"
    class="m-auto w-full max-w-lg rounded-2xl bg-surface text-ink shadow-soft backdrop:bg-black/40"
    @click="onDialogClick"
    @close="onClose"
  >
    <form class="flex flex-col gap-4 p-6" @submit.prevent="submit">
      <div class="flex items-center justify-between">
        <h2 id="book-dialog-heading" class="font-serif text-2xl font-semibold">
          {{ editing ? "Lieblingsbuch bearbeiten" : "Lieblingsbuch hinzufügen" }}
        </h2>
        <button
          type="button"
          aria-label="Schließen"
          class="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-ink"
          @click="close"
        >
          <X :size="20" />
        </button>
      </div>

      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium">Titel</span>
        <input
          v-model.trim="form.title"
          required
          autofocus
          class="rounded-lg border border-line bg-canvas px-3 py-2 outline-accent"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium">Autor</span>
        <input
          v-model.trim="form.author"
          required
          class="rounded-lg border border-line bg-canvas px-3 py-2 outline-accent"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium">
          Notiz <span class="font-normal text-muted">(optional)</span>
        </span>
        <textarea
          v-model.trim="form.freeText"
          rows="4"
          class="rounded-lg border border-line bg-canvas px-3 py-2 outline-accent"
        />
      </label>

      <p v-if="error" class="text-sm text-danger">{{ error }}</p>

      <div class="mt-2 flex justify-end gap-2">
        <button
          type="button"
          class="cursor-pointer rounded-full px-5 py-2 font-medium text-muted transition hover:bg-canvas hover:text-ink"
          @click="close"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="cursor-pointer rounded-full bg-accent px-5 py-2 font-semibold text-white transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60"
        >
          {{ saving ? "Wird gespeichert…" : "Speichern" }}
        </button>
      </div>
    </form>
  </dialog>
</template>
