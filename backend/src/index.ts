import express from "express";
import dotenv from "dotenv";
import db, { checkConnection } from "./drizzle/db";




import { user } from "./routes/authRoute";
import { customer } from "./routes/customerRoute";
import { car } from "./routes/carRoute";
import { booking } from "./routes/bookingRoute";
import { location } from "./routes/locationRoute";
import { reservation } from "./routes/reservationRoute";
import { insurance } from "./routes/insuranceRoute";
import { maintenance } from "./routes/maintenanceRoute";
import { payment } from "./routes/paymentRoute";
import { logger } from "./middleware/logger";
import cors from "cors";
import cloudinary from "./config/cloudinaryConfig";

  



dotenv.config();




const port = process.env.PORT || 5000;
const app = express();

// test cloudinary connection
cloudinary.api.ping()
  .then(() => {
    console.log('Cloudinary connection is healthy.');
  })
  .catch((error) => {
    console.error('Cloudinary connection error:', error);
  });




// cors for all origins
app.use(cors({
  origin: 'http://localhost:5173', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods

}));




app.use(express.json())
app.use(logger)

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/health', async (req, res) => {
  try {
    await checkConnection();
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
})

// Initialize routes
user(app)
customer(app)
car(app)
booking(app)
location(app)
reservation(app)
insurance(app)
maintenance(app)
payment(app)
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











