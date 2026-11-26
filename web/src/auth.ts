import { createAuthClient } from "better-auth/vue";

// The API is proxied under /api on the same origin (Vite in dev, Caddy in
// production), so the client's defaults fit.
export const authClient = createAuthClient();
