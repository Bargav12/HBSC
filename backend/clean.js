const mongoose = require("mongoose");
const Transaction = require("./models/Transaction"); // Adjust the path if necessary

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/HSBC.hsbc", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with failure
  }
};

const cleanData = async () => {
  try {
    // Find all transactions
    const transactions = await Transaction.find({});

    // Iterate over each transaction and clean the customer field
    for (let transaction of transactions) {
      transaction.customer = transaction.customer.replace(/'/g, "");
      await transaction.save();
    }

    console.log("Data cleanup completed!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error during data cleanup:", error);
    mongoose.connection.close();
  }
};

// Connect to the database and run the cleanup script
connectDB().then(cleanData);
