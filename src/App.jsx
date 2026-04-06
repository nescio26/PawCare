import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// test route
app.get("/", (req, res) => {
  res.json({ message: "Nova Vet API Running 🐾" });
});

export default app;
