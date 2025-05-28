import express from "express";
import dotenv from "dotenv";

dotenv.config();


const app = express()
const port = process.env.PORT


app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello ')
})
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})



app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`)
})
