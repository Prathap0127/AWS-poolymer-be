import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import DBConnect from "./config/db.js";

import authRoute from "./routes/authRoute.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//DB connect
DBConnect();

//routes

app.use("/api/users", authRoute);

app.get("/", (req, res) => {
  res.send({ message: "data for search polymer" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server Listining to ${PORT} on ${process.env.MODE}`);
});
