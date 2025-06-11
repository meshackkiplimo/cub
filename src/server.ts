import app from "./index"


import dotenv from "dotenv";
import { checkConnection } from "./drizzle/db";


dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, async () => {
    try {
      await checkConnection();
      console.log("Database connection is healthy.");
      console.log(`Server is running on http://localhost:${port}`);
    } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1);
    }
  });