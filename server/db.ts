// [GSA-SRV-B-DB-01: Database Connection Pool]
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';
import 'dotenv/config';

// PostgreSQL Database Connection Pool
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/ghanchi_samaj_db';

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, { schema });
