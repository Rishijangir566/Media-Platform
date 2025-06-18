import express from "express";
const routes = express.Router();

import {
  handleProfile,
  handleRegister,
  handleLogin,
} from "../Controllers/authController.js";

import multer from "multer";
import { protect } from "../Middleware/authMiddleware.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });

routes.post("/register", handleRegister);
routes.post("/login",handleLogin)
routes.post("/profile",protect, upload.single("profilePic"), handleProfile);
export default routes;
