import type { ArticleUsage } from "@/lib/types";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  uuid,
  integer,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  externalId: uuid("external_id").unique(), // id from supabase auth
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  name: varchar("name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const articleStatus = pgEnum("article_status", [
  "processing",
  "processed",
  "error",
]);

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  status: articleStatus("status").default("processing").notNull(),
  source: text("source").notNull().unique(),
  readTime: integer("read_time").notNull(),
  audioUrl: text("audio_url"),
  description: varchar("description", { length: 50 }).notNull(),
  summary: text("summary"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  usage: jsonb("usage").$type<ArticleUsage>(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});
