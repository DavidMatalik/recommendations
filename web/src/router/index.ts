import { createRouter, createWebHistory } from "vue-router";
import { authClient } from "@/auth";
import LoginPage from "@/features/auth/LoginPage.vue";
import RegisterPage from "@/features/auth/RegisterPage.vue";
import FavoriteBooksPage from "@/features/books/FavoriteBooksPage.vue";
import RecommendationsPage from "@/features/recommendations/RecommendationsPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/favorite-books" },
    { path: "/favorite-books", component: FavoriteBooksPage },
    { path: "/recommendations", component: RecommendationsPage },
    { path: "/login", component: LoginPage, meta: { guestOnly: true } },
    { path: "/register", component: RegisterPage, meta: { guestOnly: true } },
  ],
});

// Every page needs a session except the guest-only ones, which signed-in
// users skip.
router.beforeEach(async (to) => {
  const { data: session } = await authClient.getSession();
  if (to.meta.guestOnly) return session ? "/favorite-books" : true;
  return session ? true : "/login";
});
