import { integer, pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

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

const bookFields = {
  title: true,
  author: true,
  status: true,
  freeText: true,
  aiSummary: true,
} as const;

export const insertBookSchema = createInsertSchema(booksTable, {
  title: (schema) => schema.min(1),
  author: (schema) => schema.min(1),
}).pick(bookFields);

export const updateBookSchema = createUpdateSchema(booksTable, {
  title: (schema) => schema.min(1),
  author: (schema) => schema.min(1),
})
  .pick(bookFields)
  .refine((data) => Object.keys(data).length > 0, "No fields to update");
