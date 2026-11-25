import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { booksTable } from "../db/schema/book.js";

export const bookRoutes = new Hono()
  .get("/", async (c) => {
    const books = await db.select().from(booksTable);
    return c.json(books);
  })
  .get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const [book] = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.id, id))
      .limit(1);
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  })
  .post("/", async (c) => {
    const { title, author, status, freeText, aiSummary } = await c.req.json<{
      title: string;
      author: string;
      status: "favorite" | "recommended" | "not_interested";
      freeText: string;
      aiSummary: string;
    }>();
    const [book] = await db
      .insert(booksTable)
      .values({ title, author, status, freeText, aiSummary })
      .returning();
    return c.json(book, 201);
  })
  .patch("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const { title, author, status, freeText, aiSummary } =
      await c.req.json<Partial<typeof booksTable.$inferInsert>>();
    const [book] = await db
      .update(booksTable)
      .set({ title, author, status, freeText, aiSummary })
      .where(eq(booksTable.id, id))
      .returning();
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  })
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const [book] = await db
      .delete(booksTable)
      .where(eq(booksTable.id, id))
      .returning();
    if (!book) return c.json({ error: "Book not found" }, 404);
    return c.json(book);
  });
