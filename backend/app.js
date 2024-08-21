const express = require("express");
const cors = require("cors");
require("./conn/conn");
const transactionRoutes = require("./routes/transactions");

const app = express();

// Middleware to handle JSON requests
app.use(express.json());

// Enable CORS
app.use(cors());

// Use transaction routes for /api/transactions endpoint
app.use("/api/transactions", transactionRoutes);

const PORT = 1000;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
