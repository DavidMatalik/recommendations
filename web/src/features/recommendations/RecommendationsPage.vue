<script setup lang="ts">
import { Sparkles } from "@lucide/vue";
import { computed, onMounted, ref } from "vue";
import AppNav from "@/components/AppNav.vue";
import { usePrompt } from "@/composables/usePrompt";
import type { Book } from "@/features/books/types";
import RecommendationCard from "./RecommendationCard.vue";

const prompt = usePrompt();

const books = ref<Book[]>([]);
const loading = ref(true);
const generating = ref(false);
const error = ref<string | null>(null);

const recommendations = computed(() =>
  books.value.filter((book) => book.status === "recommended"),
);

onMounted(async () => {
  try {
    const res = await fetch("/api/books");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    books.value = await res.json();
  } catch (e) {
    error.value = `Empfehlungen konnten nicht geladen werden (${(e as Error).message})`;
  } finally {
    loading.value = false;
  }
});

// New recommendations are added; existing ones stay.
async function generate() {
  generating.value = true;
  try {
    const res = await fetch("/api/recommendations/books", { method: "POST" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    books.value.push(...(await res.json()));
  } catch (e) {
    alert(`Empfehlungen fehlgeschlagen (${(e as Error).message})`);
  } finally {
    generating.value = false;
  }
}

async function update(book: Book, fields: Partial<Book>) {
  const res = await fetch(`/api/books/${book.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) return alert(`Speichern fehlgeschlagen (HTTP ${res.status})`);
  const saved: Book = await res.json();
  books.value = books.value.map((b) => (b.id === saved.id ? saved : b));
}

// The "why recommended" text becomes the favorite's editable note.
async function addToFavorites(book: Book) {
  const note = await prompt({
    title: "Zu Favoriten hinzufügen",
    label: "Notiz",
    text: book.freeText ?? "",
  });
  if (note == null) return;
  await update(book, { status: "favorite", freeText: note || null });
}

// The reason isn't shown anywhere but feeds future recommendation runs.
async function markNotInterested(book: Book) {
  const reason = await prompt({
    title: "Kein Interesse",
    label: "Warum interessiert dich das Buch nicht?",
    required: true,
  });
  if (!reason) return;
  await update(book, { status: "not_interested", freeText: reason });
}
</script>

<template>
  <AppNav />
  <main class="mx-auto max-w-2xl px-4 pb-16">
    <header class="mt-12 mb-10 flex flex-col items-center text-center">
      <h1 class="my-1 font-serif text-4xl font-semibold">Empfehlungen</h1>
      <button
        type="button"
        :disabled="generating"
        @click="generate"
        class="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-px hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60"
      >
        <Sparkles :size="18" />
        {{ generating ? "Wird empfohlen…" : "Empfehlungen holen" }}
      </button>
    </header>

    <p v-if="loading" class="text-center text-muted">Wird geladen…</p>
    <p v-else-if="error" class="text-center text-danger">{{ error }}</p>
    <div
      v-else-if="recommendations.length === 0"
      class="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-line px-4 py-12 text-muted"
    >
      <Sparkles :size="40" :stroke-width="1.5" />
      <p>Noch keine Empfehlungen. Hol dir die ersten!</p>
    </div>

    <ul v-else class="flex flex-col gap-4">
      <RecommendationCard
        v-for="book in recommendations"
        :key="book.id"
        :book="book"
        @favorite="addToFavorites(book)"
        @not-interested="markNotInterested(book)"
      />
    </ul>
  </main>
</template>
