import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { booksTable, insertBookSchema, updateBookSchema } from "../db/schema/book.js";

const idParam = zValidator(
  "param",
  z.object({ id: z.coerce.number().int().positive() }),
);

export const bookRoutes = new Hono()
  .get("/", async (c) => {
    const books = await db.select().from(booksTable);
    return c.json(books);
  })
  .get("/:id", idParam, async (c) => {
    const { id } = c.req.valid("param");
    const [book] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, id))
      .limit(1);
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  })
  .post("/", zValidator("json", insertBookSchema), async (c) => {
    const [book] = await db
      .insert(booksTable)
      .values(c.req.valid("json"))
      .returning();
    return c.json(book, 201);
  })
  .patch("/:id", idParam, zValidator("json", updateBookSchema), async (c) => {
    const { id } = c.req.valid("param");
    const [book] = await db
      .update(booksTable)
      .set(c.req.valid("json"))
      .where(eq(booksTable.id, id))
      .returning();
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  })
  .delete("/:id", idParam, async (c) => {
    const { id } = c.req.valid("param");
    const [book] = await db
      .delete(booksTable)
      .where(eq(booksTable.id, id))
      .returning();
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  });
