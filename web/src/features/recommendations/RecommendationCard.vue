<script setup lang="ts">
import { ChevronDown, Heart, ThumbsDown } from "@lucide/vue";
import { useTemplateRef } from "vue";
import { useClamped } from "@/composables/useClamped";
import type { Book } from "@/features/books/types";

const props = defineProps<{ book: Book }>();
const emit = defineEmits<{ favorite: []; notInterested: [] }>();

const { expanded, clamped } = useClamped(
  [useTemplateRef("summary"), useTemplateRef("reason")],
  () => [props.book.aiSummary, props.book.freeText],
);
</script>

<template>
  <li class="book-card">
    <div class="min-w-0">
      <h2 class="truncate font-serif text-xl font-semibold" :title="book.title">
        {{ book.title }}
      </h2>
      <p class="mt-0.5 truncate text-[0.95rem] text-muted" :title="book.author">
        von {{ book.author }}
      </p>
      <!-- Fixed space for 2 lines each + toggle keeps collapsed cards the same height. -->
      <dl class="mt-3 flex flex-col gap-2">
        <div>
          <dt class="text-sm font-semibold text-muted">Zusammenfassung</dt>
          <dd
            ref="summary"
            class="min-h-[2lh] whitespace-pre-line"
            :class="{ 'line-clamp-2': !expanded }"
          >
            {{ book.aiSummary || "–" }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-semibold text-muted">Warum empfohlen</dt>
          <dd
            ref="reason"
            class="min-h-[2lh] whitespace-pre-line italic"
            :class="{ 'line-clamp-2': !expanded }"
          >
            {{ book.freeText || "–" }}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        class="mt-1 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-accent hover:text-accent-hover"
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
        aria-label="Zu Favoriten hinzufügen"
        title="Zu Favoriten hinzufügen"
        @click="emit('favorite')"
        class="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-accent"
      >
        <Heart :size="18" />
      </button>
      <button
        type="button"
        aria-label="Kein Interesse"
        title="Kein Interesse"
        @click="emit('notInterested')"
        class="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-danger"
      >
        <ThumbsDown :size="18" />
      </button>
    </div>
  </li>
</template>
