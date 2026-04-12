import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import authRoutes from "./Modules/auth/auth.routes.js";
import userRoutes from "./Modules/users/user.routes.js";
import ownerRoutes from "./Modules/owners/owner.routes.js";
import petRoutes from "./Modules/pets/pet.routes.js";
import visitRoutes from "./Modules/visits/visit.routes.js";
import queueRoutes from "./Modules/queue/queue.routes.js";
import recordRoutes from "./Modules/records/record.routes.js";
import analyticsRoutes from "./Modules/analytics/analytics.routes.js";

const app = express();

// middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://paw-care-sigma.vercel.app",
      ];

      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// test route
app.get("/", (req, res) => {
  res.send("Nova Vet API Is Running 🚀");
});

// Auth
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", userRoutes);

// Owner
app.use("/api/owners", ownerRoutes);

// pet
app.use("/api/pets", petRoutes);

// visit
app.use("/api/visits", visitRoutes);

// queue
app.use("/api/queue", queueRoutes);

// records
app.use("/api/records", recordRoutes);

// analytics
app.use("/api/analytics", analyticsRoutes);

// uploadFile
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default app;
