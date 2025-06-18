import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import Register from "./models/register.js";

const app = express();
app.use(express.json());
connectDB();
const PORT = process.env.PORT;
const coreOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(coreOptions));

app.post("/user/register", async (req, res) => {
  const { email, ...rest } = req.body;
  console.log(req.body);
  const existingdata = await Register.findOne({ email });
  if (existingdata) {
    return res.status(409).json({ message: "Email already in use" });
  }
  try {
    const newData = new Register({ email, ...rest });

    await newData.save();

    res.status(201).json({ message: "user Successfully Registered", newData});
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Your server is running at port:${PORT}`);
});
