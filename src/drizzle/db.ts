import "dotenv/config"
import { drizzle } from 'drizzle-orm/node-postgres'; 
import { Pool } from 'pg';
import * as schema from './schema';

// Create a pool instead of a single client
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL as string,
});

// Export drizzle instance with pool
const db = drizzle(pool, {
    schema: schema,
    logger: true
});

export default db;

// Helper to check connection
export const checkConnection = async () => {
    const client = await pool.connect();
    try {
        await client.query('SELECT 1');
        return true;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

// Cleanup function for tests
export const closeConnection = async () => {
    await pool.end();
};