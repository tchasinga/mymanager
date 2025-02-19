import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbconnection from "./db/dbconnection.js";
import autoApplyForUser from "./routes/users.route.js";
import autoUserTask from "./routes/task.route.js";

// initialization
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://mymanagersite.onrender.com"],
    credentials: true,
    allowedHeaders: "*", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  })
);

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    dbconnection();
  console.log(`server is running on port ${PORT}`);
});

//   Aidding soem APis
 app.use("/apis/auth", autoApplyForUser); 
 app.use("/api/tasks", autoUserTask);