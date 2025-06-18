import Register from "../Models/register.js";
import Profile from "../Models/profile.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function generateToken(dataId) {
  return jwt.sign({ id: dataId }, process.env.JWT_SECRET);
}
export async function handleRegister(req, res) {
  const { email, ...rest } = req.body;
  const existingdata = await Register.findOne({ email });
  if (existingdata) {
    return res.status(409).json({ message: "Email already in use" });
  }
  try {
    const newData = new Register({ email, ...rest });

    await newData.save();

    res.status(201).json({ message: "user Successfully Registered", newData });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(400).json({ message: "Invalid input", error: error.message });
  }
}

export async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await Register.findOne({ email });

    if (!user || user.password !== String(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Login successful" });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(400).json({ message: "Login error" }, err);
  }
}

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (result) resolve(result);
        else reject(err);
      }
    );
    stream.end(buffer);
  });
}

export async function handleProfile(req, res) {
  const MAX_SIZE = 2 * 1024 * 1024;

  if (req.file && req.file.size > MAX_SIZE) {
    return res
      .status(400)
      .json({ message: "Profile picture must be under 2MB" });
  }

  try {
    const { name, phone, gender, dob, Address, state, city, bio } = req.body;

    let profilePicUrl = null;
    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "profile_pics"
      );
      profilePicUrl = uploaded.secure_url;
    }

    const profileData = {
      userId: req.user._id,
      name,
      phone,
      gender,
      dob,
      Address,
      state,
      city,
      bio,
      profilePic: profilePicUrl,
    };

    const newProfile = new Profile(profileData);
    const savedProfile = await newProfile.save();

    res.status(201).json({ message: "Profile created", user: savedProfile });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
