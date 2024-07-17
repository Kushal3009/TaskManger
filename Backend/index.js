const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoConnection = require("./config/db.js"); // MongoDB connection setup
const authMiddleware = require("./middleware/fetchUser.js"); // Authentication middleware
const taskRoutes = require("./routes/task.js"); // Task routes
const authRoutes = require("./routes/auth.js"); // Task routes

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser middleware

// Connect to MongoDB
mongoConnection()
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit with failure
  });

// Routes
app.use("/api/task", authMiddleware, taskRoutes); // Protect task routes with authentication
app.use("/api/auth", authRoutes); // Protect task routes with authentication

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
