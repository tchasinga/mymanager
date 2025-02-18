import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoconnection from "./db/mongoconnection.js";
import autoApply from "./routes/aply.route.js";
import authRoutes from "./routes/user.route.js";
import linksToMogoDbUrl from "./db/linksToMogoDbUrl.js";

// initialization
const app = express();

app.use(
  cors({
    origin: ["",""],
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
  linksToMogoDbUrl();
  console.log(`server is running on port ${PORT}`);
});

//   Aidding soem APis
app.use("/api", autoApply);