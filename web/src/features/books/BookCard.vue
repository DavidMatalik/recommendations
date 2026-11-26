<script setup lang="ts">
import { ChevronDown, Pencil, Trash2 } from "@lucide/vue";
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import type { Book } from "./types";

const props = defineProps<{ book: Book }>();
const emit = defineEmits<{ edit: []; delete: [] }>();

const expanded = ref(false);
const clamped = ref(false);
const freeTextEl = useTemplateRef("freeText");

// Only offer the toggle when the text is actually cut off.
function checkClamped() {
  const el = freeTextEl.value;
  if (el && !expanded.value) clamped.value = el.scrollHeight > el.clientHeight;
}

// Re-check when the card is resized or the note is edited.
const observer = new ResizeObserver(checkClamped);
watch(() => props.book.freeText, checkClamped, { flush: "post" });

onMounted(() => {
  if (freeTextEl.value) observer.observe(freeTextEl.value);
});
onBeforeUnmount(() => observer.disconnect());
</script>

<template>
  <li
    class="flex justify-between gap-4 rounded-xl border border-l-4 border-line border-l-accent bg-surface py-5 pr-5 pl-6 shadow-soft transition hover:-translate-y-0.5"
  >
    <div class="min-w-0">
      <h2 class="truncate font-serif text-xl font-semibold" :title="book.title">
        {{ book.title }}
      </h2>
      <p class="mt-0.5 truncate text-[0.95rem] text-muted" :title="book.author">
        von {{ book.author }}
      </p>
      <!-- Fixed space for 2 lines + toggle keeps collapsed cards the same height. -->
      <p
        ref="freeText"
        class="mt-3 min-h-[2lh] pl-3 whitespace-pre-line italic"
        :class="{
          'line-clamp-2': !expanded,
          'border-l-2 border-line': book.freeText,
          'text-muted': !book.freeText,
        }"
      >
        {{ book.freeText || "Keine Notiz" }}
      </p>
      <button
        type="button"
        class="mt-1 ml-3 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
        :class="{ invisible: !clamped }"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ expanded ? "Weniger anzeigen" : "Mehr anzeigen" }}
        <ChevronDown
          :size="16"
          class="transition-transform"
          :class="{ 'rotate-180': expanded }"
        />
      </button>
    </div>
    <div class="flex items-start gap-1">
      <button
        type="button"
        aria-label="Buch bearbeiten"
        @click="emit('edit')"
        class="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-ink"
      >
        <Pencil :size="18" />
      </button>
      <button
        type="button"
        aria-label="Buch löschen"
        @click="emit('delete')"
        class="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-danger"
      >
        <Trash2 :size="18" />
      </button>
    </div>
  </li>
</template>
