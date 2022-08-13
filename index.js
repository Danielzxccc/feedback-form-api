const { Client } = require("pg");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const port = 4000;
const cors = require('cors');

dotenv.config();
const client = new Client(process.env.DATABASE_URL);

//middlewares
app.use(express.json());
client.connect();
app.use(cors());

//routes
app.post("/feedback", async (req, res) => {
  const { message, typeoftask } = req.body;
  try {
     const { rows } = await client.query(
    "INSERT INTO feedback (message, typeoftask) VALUES ($1, $2) RETURNING *",
    [message, typeoftask],)
    res.status(201).send({id : rows[0].id})
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get("/getfeedback", async (req, res) =>{
  try {
    const { rows } = await client.query("SELECT * FROM feedback ORDER BY id DESC")
    res.status(200).send(rows);
  } catch (e) {
      res.status(400).send(e)
  }
})


app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

