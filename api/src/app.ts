import { Hono } from "hono";
import { auth } from "./auth.js";
import { bookRoutes } from "./routes/books.js";

// Builds the app; index.ts starts the server. Keeping them apart lets other
// code import the app (e.g. RPC types, tests) without opening a port.
// The web app proxies /api to here, so the browser sees a single origin and
// no CORS is needed.
export const app = new Hono()
  .basePath("/api")
  .on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw))
  .route("/books", bookRoutes);
