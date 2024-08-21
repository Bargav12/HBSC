const express = require("express");
const Transaction = require("../models/Transaction"); // Import the Transaction model

const router = express.Router();

// Route to get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    console.log("Fetched transactions:", transactions);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Route to get transactions by category (e.g., transportation, shopping)
router.get("/category/:category", async (req, res) => {
  try {
    const transactions = await Transaction.find({ category: req.params.category });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Route to get aggregated data (e.g., total amount by category)
router.get("/aggregate", async (req, res) => {
  try {
    const aggregation = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(aggregation);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Route to add a new transaction (if needed)
router.post("/", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: "Failed to add transaction", error });
  }
});

module.exports = router;
