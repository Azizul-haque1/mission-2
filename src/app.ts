import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({ message: "express", author: "Next level" });
});

app.use("/api/users", userRoute);

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      
      `);

    res.status(200).json({
      success: true,
      message: "Users retrived successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  // console.log("id", id);
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, password, age, is_active } = req.body;

  console.log("id", id);
  console.log({ name, password, age, is_active });

  try {
    const result = await pool.query(
      `
      UPDATE users SET 
      name=COALESCE($1, name), 
      password=COALESCE($2, password), 
      age=COALESCE($3, age), 
      is_active=COALESCE($4, is_active)
      WHERE id=$5
      RETURNING name,age, is_active
      `,
      [name, password, age, is_active, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User update successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM users WHERE id=$1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }
    console.log("result", result);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

export default app;
