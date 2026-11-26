import { createAuthClient } from "better-auth/vue";
import { apiUrl } from "@/api";

export const authClient = createAuthClient({
  baseURL: apiUrl,
  fetchOptions: { credentials: "include" },
});
