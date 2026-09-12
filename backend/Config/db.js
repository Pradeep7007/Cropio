require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  const atlasUri = process.env.MONGODB_URI;
  const localUri = process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017/cropio";

  if (atlasUri) {
    try {
      console.log("⏳ Attempting to connect to MongoDB Atlas...");
      await mongoose.connect(atlasUri, {
        serverSelectionTimeoutMS: 6000,
      });
      console.log("✅ Successfully connected to MongoDB Atlas!");
      return;
    } catch (atlasErr) {
      console.warn("⚠️ MongoDB Atlas connection error:", atlasErr.message);
      console.warn(
        "💡 Tip: If you see an SSL alert 80 / timeout error, ensure your current IP address or 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access."
      );
    }
  }

  // Fallback to local MongoDB
  try {
    console.log("⏳ Attempting fallback to local MongoDB instance (" + localUri + ")...");
    await mongoose.connect(localUri);
    console.log("✅ Connected to Local MongoDB!");
  } catch (localErr) {
    console.error("❌ Failed to connect to local MongoDB as well:", localErr.message);
  }
};

module.exports = connectDb;
