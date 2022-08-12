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
  await client.query(
    "INSERT INTO feedback (message, typeoftask) VALUES ($1, $2) RETURNING *",
    [message, typeoftask],
    (error, result) => {
      if (error) {
        res.status(400).send(error);
      }
      res.status(201).send(`Feedback added with ID: ${result.rows[0].id}`);
    }
  );
});

app.get("/getfeedback", async (req, res) => {
  await client.query("SELECT * FROM feedback ORDER BY id DESC", (error, result) => {
    if (error) {
      res.status(400).send(error);
    }
    res.status(200).json(result.rows);
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// (async () => {
//   await client.connect();
//   try {
//     const results = await client.query("SELECT NOW()");
//     console.log(results);
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     client.end();
//   }
// })();
