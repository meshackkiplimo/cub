import "dotenv/config";
import { migrate } from "drizzle-orm/neon-http/migrator"; // ✅ Use neon-http
import db from "./db"; // ✅ Only default export

async function migration() {
  console.log("......Migrations Started......");
  await migrate(db, { migrationsFolder: __dirname + "/migrations" });
  console.log("......Migrations Completed......");
  process.exit(0); // success
}

migration().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1); // error
});
