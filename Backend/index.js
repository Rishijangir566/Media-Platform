import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./Config/db.js";
import authRouter from "./Routes/auth.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: process.env.FRONTEND_URI,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders:["Content-Type","Authorization"],

};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/user", authRouter);

connectDB()

app.listen(PORT, () => {
  console.log(`Your server is running at port:${PORT}`);
});
