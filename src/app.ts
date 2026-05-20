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








export default app;
