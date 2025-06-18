import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./Config/db.js";
import authRouter from "./Routes/auth.js";
import cookieParser from "cookie-parser";

app.use(cookieParser());

const app = express();
app.use(express.json());
connectDB();
const PORT = process.env.PORT;
const coreOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(coreOptions));

app.use("/user", authRouter);

app.listen(PORT, () => {
  console.log(`Your server is running at port:${PORT}`);
});
