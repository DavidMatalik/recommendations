<script setup lang="ts">
import { BookHeart, Pencil, Plus, Trash2 } from "@lucide/vue";
import { computed, onMounted, ref } from "vue";

interface Book {
  id: number;
  title: string;
  author: string;
  status: "favorite" | "recommended" | "not_interested" | null;
  freeText: string | null;
}

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const books = ref<Book[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const favorites = computed(() =>
  books.value.filter((book) => book.status === "favorite"),
);

onMounted(async () => {
  try {
    const res = await fetch(`${apiUrl}/books`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    books.value = await res.json();
  } catch (e) {
    error.value = `Bücher konnten nicht geladen werden (${(e as Error).message})`;
  } finally {
    loading.value = false;
  }
});
</script>


<template>
  <main class="mx-auto max-w-2xl px-4 pt-12 pb-16">
    <header class="mb-10 flex flex-col items-center text-center">
      <p
        class="text-xs font-semibold tracking-[0.12em] text-accent uppercase"
      >
        Mein Regal
      </p>
      <h1 class="my-1 font-serif text-4xl font-semibold">Lieblingsbücher</h1>
      <p v-if="!loading && !error" class="text-muted">
        {{ favorites.length }}
        {{ favorites.length === 1 ? "Buch" : "Bücher" }} zum Wiederlesen
      </p>
      <button
        type="button"
        class="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-px hover:bg-accent-hover"
      >
        <Plus :size="18" />
        Lieblingsbuch hinzufügen
      </button>
    </header>

    <p v-if="loading" class="text-center text-muted">Wird geladen…</p>
    <p v-else-if="error" class="text-center text-danger">{{ error }}</p>
    <div
      v-else-if="favorites.length === 0"
      class="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-line px-4 py-12 text-muted"
    >
      <BookHeart :size="40" :stroke-width="1.5" />
      <p>Noch keine Lieblingsbücher. Füge das erste hinzu!</p>
    </div>

    <ul v-else class="flex flex-col gap-4">
      <li
        v-for="book in favorites"
        :key="book.id"
        class="flex justify-between gap-4 rounded-xl border border-l-4 border-line border-l-accent bg-surface py-5 pr-5 pl-6 shadow-soft transition hover:-translate-y-0.5"
      >
        <div class="min-w-0">
          <h2 class="font-serif text-xl font-semibold">{{ book.title }}</h2>
          <p class="mt-0.5 text-[0.95rem] text-muted">von {{ book.author }}</p>
          <p
            v-if="book.freeText"
            class="mt-3 line-clamp-2 border-l-2 border-line pl-3 italic"
          >
            {{ book.freeText }}
          </p>
        </div>
        <div class="flex items-start gap-1">
          <button
            type="button"
            aria-label="Buch bearbeiten"
            class="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-ink"
          >
            <Pencil :size="18" />
          </button>
          <button
            type="button"
            aria-label="Buch löschen"
            class="cursor-pointer rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-danger"
          >
            <Trash2 :size="18" />
          </button>
        </div>
      </li>
    </ul>
  </main>
</template>
