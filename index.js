const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoConnection = require("./config/db.js"); // Assuming connectDB returns a promise
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use the CORS middleware before defining any routes
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Use JSON parser middleware
app.use(express.json());

// Routes
app.use("/api/auth/", require("./routes/auth.js"));
app.use("/api/task/", require("./routes/task.js"));

const startServer = async () => {
  try {
    await mongoConnection(); // Assuming connectDB is an async function that connects to the database
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
