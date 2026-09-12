const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./Config/db");
const FarmerRoutes = require("./Routes/FarmerRoutes");
const AuthRoutes = require("./Routes/AuthRoutes");

dotenv.config();

// Connect to MongoDB
connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

app.use("/api/auth", AuthRoutes);
app.use("/api/farmer", FarmerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

