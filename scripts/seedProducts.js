import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB connected");

    const batchSize = 5000;

    let products = [];

    for (let i = 1; i <= 200000; i++) {
      products.push({
        name: `Product ${i}`,
        category: ["electronics", "fashion", "books", "sports"][
          Math.floor(Math.random() * 4)
        ],

        price: Number((Math.random() * 1000).toFixed(2)),

        productId: i,

        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // insert every 5000 products
      if (products.length === batchSize) {
        await Product.insertMany(products);

        console.log(`${i} products inserted`);

        products = [];
      }
    }

    // insert remaining
    if (products.length > 0) {
      await Product.insertMany(products);
    }

    console.log("200000 products created");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedProducts();
