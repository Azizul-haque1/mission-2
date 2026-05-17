import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import { p } from "../../../../../../../node_modules/react-router/dist/development/index-react-server-client-BSxMvS7Z";
const app: Application = express();
const port = 4000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_YrMV2h8lnELt@ep-little-poetry-aqqfk3w5-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(20) NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      create_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()

      )
        `);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

initDB();
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "express", author: "Next level" });
});

// app.post("/", (req: Request, res: Response) => {
//   // const { email, password, age, name } = req.body;
//   // console.log();
//   res.send(req.body);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
