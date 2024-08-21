const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  step: Number,
  customer: String,
  age: String,
  gender: String,
  zipcodeOri: String,
  merchant: String,
  zipMerchant: String,
  category: String,
  amount: Number,
  fraud: Number,
});

const Transaction = mongoose.model("Transaction", transactionSchema, "transactions");

module.exports = Transaction;
