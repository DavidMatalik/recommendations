import { createRouter, createWebHistory } from "vue-router";
import FavoriteBooksPage from "@/features/books/FavoriteBooksPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/favorite-books" },
    { path: "/favorite-books", component: FavoriteBooksPage },
  ],
});
