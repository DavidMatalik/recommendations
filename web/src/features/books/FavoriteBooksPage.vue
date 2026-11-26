<script setup lang="ts">
import { BookHeart, Plus } from "@lucide/vue";
import { computed, onMounted, ref } from "vue";
import type { Book } from "./types";
import BookCard from "./BookCard.vue";

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
      <h1 class="my-1 font-serif text-4xl font-semibold">Lieblingsbücher</h1>
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
      <BookCard v-for="book in favorites" :key="book.id" :book="book" />
    </ul>
  </main>
</template>
