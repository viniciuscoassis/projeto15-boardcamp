import express from "express";
import connection from "./database/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/categories", async (req, res) => {
  const clientes = await connection.query("SELECT * FROM categories;");
  res.send(clientes.rows);
});

app.post("/categories", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.sendStatus(400);
  }

  const NameExiste = await connection.query(
    "SELECT * FROM categories WHERE name = $1",
    [name]
  );

  if (NameExiste.rows.length != 0) {
    return res.status(409).send("Este jogo já existe");
  }

  const rep = await connection.query(
    "INSERT INTO categories (name) VALUES ($1)",
    [name]
  );

  res.sendStatus(201);
});

app.listen(4000, () => console.log("listening..."));
