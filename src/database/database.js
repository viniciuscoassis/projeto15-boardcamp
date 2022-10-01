import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config();

const connection = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "boardcamp",
  password: "123  1",
});

export default connection;
