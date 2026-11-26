import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db/index.js";
import * as schema from "./db/schema/auth.js";

// BETTER_AUTH_URL is the web app's public URL, since the API is proxied
// behind it. Better Auth trusts that origin by default.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
});
