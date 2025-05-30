import express from "express";
import dotenv from "dotenv";
import db from "./drizzle/db";
import { user } from "./routes/authRoute";
import { customer } from "./routes/customerRoute";
import { car } from "./routes/carRoute";
import { booking } from "./routes/bookingRoute";
import { location } from "./routes/locationRoute";
import { reservation } from "./routes/reservationRoute";
import { insurance } from "./routes/insuranceRoute";
import { maintenance } from "./routes/maintenanceRoute";
import { payment } from "./routes/paymentRoute";


dotenv.config();


const app = express()
const port = process.env.PORT


app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello ')
})
app.get('/health', (req, res) => {
  res.status(200).send('the page is very healthy')
})


user(app)
customer(app)
car(app)
booking(app)
location(app)
reservation(app)
insurance(app)
maintenance(app)
payment(app)


async function checkDatabase() {
    try {
        await db.execute("SELECT 1");
        console.log("Database connection is healthy.");
        
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Database connection failed");
        
    }
    
}

app.listen(port, () => {
    checkDatabase()
  console.log(`server is running on http://localhost:${port}`)
})
