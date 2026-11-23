"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// [GSA-SRV-B-MIG-01: Drizzle Database Migration Script]
require("dotenv/config");
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
async function runMigration() {
    console.log('Connecting to database...');
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const db = (0, node_postgres_1.drizzle)(pool);
    console.log('Running migrations...');
    try {
        await (0, migrator_1.migrate)(db, { migrationsFolder: './drizzle' });
        console.log('✅ Migrations applied successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
    }
    finally {
        await pool.end();
    }
}
runMigration();
