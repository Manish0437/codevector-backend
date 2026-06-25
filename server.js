import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import mongoose from "mongoose";
import Product from "./models/product.js";
import dotenv from "dotenv";

dotenv.config();


const app = express();
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173","https://codevector-frontend-kdnur2c4e-manish0437s-projects.vercel.app"];

console.log("Allowed Origins:", allowedOrigins); // Debug log

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type"],
    })
);

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 3000;

const dbUrl = process.env.MONGODB_URL;
if (!dbUrl) {
    console.error("MONGODB_URL is not defined in environment variables");
    process.exit(1);
}
mongoose
  .connect(dbUrl, {
    retryWrites: true,
    w: "majority",
  })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


// Test Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});
app.use("/products",productRoutes);

app.get("/api/products", (req, res) => {
    Product.find()
        .then((products) => {
            res.json(products);
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Internal server error" });
        });
});



// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });