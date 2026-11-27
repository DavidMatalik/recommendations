import { Hono } from "hono";
import { type AuthEnv, requireAuth } from "../middleware/auth.js";
import { booksTable } from "../db/schema/book.js";
import { db } from "../db/index.js";

export const recommendationRoutes = new Hono<AuthEnv>()
  .use(requireAuth)
  .post("/books", async (c) => {
    // Todo: Long term: Trigger call to AI provider of user with AI token of user with favorite books of user with a prompt to generate recommendations
    // For now: just generate some fake recommandations
    const books = await db
      .insert(booksTable)
      .values(
        Array.from({ length: 5 }, (_, i) => ({
          title: `Titel ${i + 1}`,
          author: `Autor ${i + 1}`,
          aiSummary: `Zusammenfassung von Titel ${i + 1}.`,
          // Why it's recommended; becomes the note if added to favorites.
          freeText: `Empfohlen, weil es zu deinen Lieblingsbüchern passt. sdfdsfdsfdsf sdfdsfdsfdsf sdfdsfdsf  sdfdsfdsfdsf sdfsdfdsfdsf sdfdsfdsfdsf sdfdsfdsfdsfdsf sdfdsfdsfdsf sdfdsfdsfdsfdsf sdfdsfdssdfsdfsdf  sdfdsfdsfsdf`,
          status: "recommended" as const,
          userId: c.get("user").id,
        })),
      )
      .returning();
    return c.json(books, 201);
  });
