import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { relations } from 'drizzle-orm';
import { mysqlTable, serial, text, mysqlEnum, varchar } from 'drizzle-orm/mysql-core';

export const insights = mysqlTable('insights', {
  id: varchar('id', { length: 100 }).primaryKey(),
  sentiment: mysqlEnum('sentiment', ['very positive', 'positive', 'neutral', 'negative', 'very negative']),
  summary: text('summary'),
});

export const keywords = mysqlTable('keywords', {
  id: serial('id').autoincrement().primaryKey(),
  name: text('name'),
  insightId: text('insight_id'),
});

export const categories = mysqlTable('categories', {
  id: serial('id').autoincrement().primaryKey(),
  name: text('name'),
  insightId: text('insight_id'),
});

const keywordsRelations = relations(keywords, ({ one }) => ({
  insight: one(insights, {
    fields: [keywords.insightId],
    references: [insights.id],
  }),
}));

const categoriesRelations = relations(categories, ({ one }) => ({
  insight: one(insights, {
    fields: [categories.insightId],
    references: [insights.id],
  }),
}));

const insightsRelations = relations(insights, ({ many }) => ({
  keywords: many(keywords),
  categories: many(categories),
}));

export const createDb = ({ DATABASE_URL: url }: Env) => {
  // Create the connection
  const connection = connect({
    url,
  });

  return drizzle(connection, { schema: { keywords, insights, categories, keywordsRelations, insightsRelations, categoriesRelations } });
};

export type DB = ReturnType<typeof createDb>;
