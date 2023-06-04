import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
config();

export default {
  schema: './src/db.ts',
  out: './drizzle',
  connectionString: process.env.DATABASE_URL,
} satisfies Config;
