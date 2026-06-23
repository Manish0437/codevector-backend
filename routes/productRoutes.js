import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;

    const cursorDate = req.query.createdAt;

    const cursorId = req.query.id;

    let query = {};

    // cursor exists
    if (cursorDate && cursorId) {
      query = {
        $or: [
          {
            createdAt: {
              $lt: new Date(cursorDate),
            },
          },

          {
            createdAt: new Date(cursorDate),

            _id: {
              $lt: cursorId,
            },
          },
        ],
      };
    }

    // category filter

    if (req.query.category) {
      query.category = req.query.category;
    }

    const products = await Product.find(query)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit);

    let nextCursor = null;

    if (products.length > 0) {
      const last = products[products.length - 1];

      nextCursor = {
        createdAt: last.createdAt,

        id: last._id,
      };
    }

    res.json({
      products,

      nextCursor,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
