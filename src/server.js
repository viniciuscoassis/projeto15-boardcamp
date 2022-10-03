import express from "express";
import connection from "./database/database.js";
import dotenv from "dotenv";
import Joi from "joi";

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
    return res.status(409).send("Esta categoria já existe");
  }

  const rep = await connection.query(
    "INSERT INTO categories (name) VALUES ($1)",
    [name]
  );

  res.sendStatus(201);
});

app.get("/games", async (req, res) => {
  const { name } = req.query;
  if (name) {
    const allGames = await connection.query(
      `SELECT * FROM games WHERE lower(name) LIKE '${name}%';`
    );
    return res.send(allGames.rows);
  }

  const allGames = await connection.query(
    'SELECT games.*,categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;'
  );

  return res.send(allGames.rows);
});

app.post("/games", async (req, res) => {
  const { name, stockTotal, pricePerDay, categoryId, image } = req.body;

  const categoriaExistente = await connection.query(
    "SELECT * FROM categories WHERE id = $1;",
    [categoryId]
  );

  const jogoExistente = await connection.query(
    "SELECT * FROM games WHERE name=$1;",
    [name]
  );

  if (jogoExistente.rows.length != 0)
    return res.status(409).send("Jogo já existe");

  if (
    !name ||
    stockTotal < 0 ||
    pricePerDay < 0 ||
    categoriaExistente.rows.length === 0
  )
    return res.sendStatus(400);

  const inserirJogo = await connection.query(
    'INSERT INTO games (name,"stockTotal","pricePerDay","categoryId", image) VALUES ($1,$2,$3,$4,$5)',
    [name, stockTotal, pricePerDay, categoryId, image]
  );

  return res.sendStatus(201);
});

const customerSchema = Joi.object({
  name: Joi.required(),
  phone: Joi.string().min(10).max(11).required(),
  cpf: Joi.string().min(11).max(11).required(),
  birthday: Joi.date().required(),
});

app.post("/customers", async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;

  const { error, value } = customerSchema.validate(
    {
      name,
      phone,
      cpf,
      birthday,
    },
    { abortEarly: false }
  );
  if (error) {
    return res.sendStatus(400);
  }

  const jaExiste = await connection.query(
    "SELECT * FROM customers WHERE cpf = $1",
    [cpf]
  );
  if (jaExiste.rows.length > 0) return res.sendStatus(409);

  const inserirCLiente = await connection.query(
    "INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4);",
    [name, phone, cpf, birthday]
  );
  return res.sendStatus(201);
});

app.get("/customers", async (req, res) => {
  const allCustomers = await connection.query("SELECT * FROM customers;");
  res.send(allCustomers.rows);
});

app.listen(4000, () => console.log("listening..."));
