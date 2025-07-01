import "dotenv/config"
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Create neon connection
const sql = neon(process.env.DATABASE_URL!);

// Create drizzle instance
const db = drizzle(sql, {
    schema: schema,
    logger: false, // Disable logging for production
});

export default db;

// Helper to check connection
export const checkConnection = async () => {
    try {
        await sql`SELECT 1`;
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

// Cleanup function for tests
export const closeConnection = async () => {
    // Neon HTTP doesn't require explicit cleanup
    return Promise.resolve();
};