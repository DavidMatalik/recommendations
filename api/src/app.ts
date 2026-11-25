import { Hono } from "hono";
import { bookRoutes } from "./routes/books.js";

// Builds the app; index.ts starts the server. Keeping them apart lets other
// code import the app (e.g. RPC types, tests) without opening a port.
export const app = new Hono().route("/books", bookRoutes);
