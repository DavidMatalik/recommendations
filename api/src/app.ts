import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";
import { bookRoutes } from "./routes/books.js";

// Builds the app; index.ts starts the server. Keeping them apart lets other
// code import the app (e.g. RPC types, tests) without opening a port.
export const app = new Hono()
  .use(
    "*",
    cors({
      origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
      credentials: true,
    }),
  )
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .route("/books", bookRoutes);
