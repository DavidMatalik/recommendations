import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { booksTable, insertBookSchema, updateBookSchema } from "../db/schema/book.js";
import { requireAuth, type AuthEnv } from "../middleware/auth.js";

const idParam = zValidator(
  "param",
  z.object({ id: z.coerce.number().int().positive() }),
);

const ownBook = (id: number, userId: string) =>
  and(eq(booksTable.id, id), eq(booksTable.userId, userId));

export const bookRoutes = new Hono<AuthEnv>()
  .use(requireAuth)
  .get("/", async (c) => {
    const books = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.userId, c.get("user").id));
    return c.json(books);
  })
  .get("/:id", idParam, async (c) => {
    const { id } = c.req.valid("param");
    const [book] = await db
      .select()
      .from(booksTable)
      .where(ownBook(id, c.get("user").id))
      .limit(1);
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  })
  .post("/", zValidator("json", insertBookSchema), async (c) => {
    const [book] = await db
      .insert(booksTable)
      .values({ ...c.req.valid("json"), userId: c.get("user").id })
      .returning();
    return c.json(book, 201);
  })
  .patch("/:id", idParam, zValidator("json", updateBookSchema), async (c) => {
    const { id } = c.req.valid("param");
    const [book] = await db
      .update(booksTable)
      .set(c.req.valid("json"))
      .where(ownBook(id, c.get("user").id))
      .returning();
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  })
  .delete("/:id", idParam, async (c) => {
    const { id } = c.req.valid("param");
    const [book] = await db
      .delete(booksTable)
      .where(ownBook(id, c.get("user").id))
      .returning();
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  });
