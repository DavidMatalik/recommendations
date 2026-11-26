import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "@/features/auth/RegisterPage.vue";
import FavoriteBooksPage from "@/features/books/FavoriteBooksPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/favorite-books" },
    { path: "/favorite-books", component: FavoriteBooksPage },
    { path: "/register", component: RegisterPage },
  ],
});
