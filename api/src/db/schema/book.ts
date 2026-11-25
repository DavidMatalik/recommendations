import { integer, pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

export const mediaStatusEnum = pgEnum("status", [
  "favorite",
  "recommended",
  "not_interested",
]);

export const booksTable = pgTable("books", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  author: text().notNull(),
  status: mediaStatusEnum(),
  freeText: text(),
  aiSummary: text(),
  ...timestamps,
});
