<script setup lang="ts">
import { LogOut } from "@lucide/vue";
import { useRouter } from "vue-router";
import { authClient } from "@/auth";

const router = useRouter();

const links = [
  { to: "/favorite-books", label: "Lieblingsbücher" },
  { to: "/recommendations", label: "Empfehlungen" },
];

async function signOut() {
  await authClient.signOut();
  router.push("/login");
}
</script>

<template>
  <nav
    class="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 pt-6"
  >
    <div class="flex gap-1">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink"
        active-class="bg-surface !text-ink shadow-soft"
      >
        {{ link.label }}
      </RouterLink>
    </div>
    <button
      type="button"
      aria-label="Abmelden"
      title="Abmelden"
      class="cursor-pointer rounded-full p-2.5 text-muted transition hover:bg-surface hover:text-ink"
      @click="signOut"
    >
      <LogOut :size="18" />
    </button>
  </nav>
</template>
