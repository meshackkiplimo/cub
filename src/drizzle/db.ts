import "dotenv/config"
import { drizzle } from 'drizzle-orm/node-postgres'; 
import {Client} from 'pg';
import * as schema from './schema';


export const client = new Client({
    connectionString: process.env.DATABASE_URL as string,

})

const main = async () =>{
    await client.connect();

}
main().then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.error('Error connecting to the database:', error);
});

const db = drizzle(client, {
    schema: schema,
    logger: true
    
})
export default db;