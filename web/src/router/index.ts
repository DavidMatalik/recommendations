import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/features/auth/LoginPage.vue";
import RegisterPage from "@/features/auth/RegisterPage.vue";
import FavoriteBooksPage from "@/features/books/FavoriteBooksPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/favorite-books" },
    { path: "/favorite-books", component: FavoriteBooksPage },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
  ],
});
