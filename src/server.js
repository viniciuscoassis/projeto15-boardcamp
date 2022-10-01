import express from "express";
import connection from "./database/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/status", async (req, res) => {
  const clientes = await connection.query("SELECT * FROM customers;");
  res.send(clientes.rows);
});

app.listen(4000, () => console.log("listening..."));
