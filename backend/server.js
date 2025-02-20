import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import dbconnection from "./db/dbconnection.js";
import autoApplyForUser from "./routes/users.route.js";
import autoUserTask from "./routes/task.route.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mymanagersite.onrender.com/"],
    credentials: true,
    allowedHeaders: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  })
);
app.use(express.json());
app.use(cookieParser());

// API routes should be defined **before** static file serving
app.use("/apis/auth", autoApplyForUser);
app.use("/api/tasks", autoUserTask);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

// Start server and connect to database
app.listen(PORT, () => {
  dbconnection();
  console.log(`Server is running on port ${PORT}`);
});
