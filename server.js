import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import mongoose from "mongoose";
import Product from "./models/product.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://codevector-frontend-kdnur2c4e-manish0437s-projects.vercel.app",
];

console.log("Allowed Origins:", allowedOrigins); // Debug log

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  }),
);

// Express json middleware

app.use(express.json());

// =====================
// DATABASE
// =====================

const PORT = process.env.PORT || 3000;

const dbUrl = process.env.MONGODB_URL;

if (!dbUrl) {
  console.log("MONGODB_URL missing");

  process.exit(1);
}

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB error:", error);
  });

// =====================
// ROUTES
// =====================

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/products", productRoutes);
