<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { authClient } from "@/auth";

const router = useRouter();

const form = reactive({ email: "", password: "" });
const submitting = ref(false);
const error = ref<string | null>(null);

async function submit() {
  submitting.value = true;
  error.value = null;
  const { error: signInError } = await authClient.signIn.email({ ...form });
  submitting.value = false;
  if (signInError) {
    error.value =
      signInError.status === 401
        ? "E-Mail oder Passwort ist falsch."
        : `Anmeldung fehlgeschlagen (${signInError.message ?? signInError.status})`;
    return;
  }
  router.push("/favorite-books");
}
</script>

<template>
  <main class="mx-auto max-w-sm px-4 pt-12 pb-16">
    <h1 class="mb-8 text-center font-serif text-4xl font-semibold">Anmelden</h1>

    <form
      class="flex flex-col gap-4 rounded-2xl bg-surface p-6 shadow-soft"
      @submit.prevent="submit"
    >
      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium">E-Mail</span>
        <input
          v-model.trim="form.email"
          type="email"
          required
          autocomplete="email"
          autofocus
          class="rounded-lg border border-line bg-canvas px-3 py-2 outline-accent"
        />
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium">Passwort</span>
        <input
          v-model="form.password"
          type="password"
          required
          autocomplete="current-password"
          class="rounded-lg border border-line bg-canvas px-3 py-2 outline-accent"
        />
      </label>

      <p v-if="error" class="text-sm text-danger">{{ error }}</p>

      <button
        type="submit"
        :disabled="submitting"
        class="mt-2 cursor-pointer rounded-full bg-accent px-5 py-2 font-semibold text-white transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60"
      >
        {{ submitting ? "Wird angemeldet…" : "Anmelden" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-muted">
      Noch kein Konto?
      <RouterLink to="/register" class="font-medium text-accent hover:underline">
        Registrieren
      </RouterLink>
    </p>
  </main>
</template>
