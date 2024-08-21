const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use a valid database name without a period
    await mongoose.connect("mongodb://localhost:27017/HSBC_hsbc", {
      // Remove deprecated options
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with failure
  }
};

connectDB();
