import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:HxgMvYd6u992@127.0.0.1:5432/ghanchi_samaj_db",
  },
} satisfies Config;
