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

export async function githubAuthorization(req, res) {
  try {
    const { code, redirectUri } = req.body;

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return res.status(400).json({
        success: false,
        message: "Failed to get access token from GitHub",
      });
    }

    // Fetch GitHub user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      return res.status(400).json({ success: false, message: "Failed to fetch GitHub user details" });
    }

    const githubUser = await userResponse.json();

    // Optional: fetch emails
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const emails = await emailsResponse.json();

    // Optional: fetch events
    const eventsResponse = await fetch(`https://api.github.com/users/${githubUser.login}/events`, {
      headers: {
        Authorization: `token ${access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const events = await eventsResponse.json();

    res.status(200).json({
      message: "GitHub Authentication Completed",
      githubUser,
      emails,
      events,
    });
  } catch (err) {
    console.error("GitHub OAuth Error:", err.message);
    res.status(500).json({ error: "OAuth failed", details: err.message });
  }
}

export async function googleAuthorization(req, res) {
  try {
    const { code } = req.body;

    // Step 1: Exchange code for access_token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:5173/google/callback",
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData?.access_token;

    if (!access_token) {
      return res.status(400).json({ message: "Failed to get access token from Google" });
    }

    // Step 2: Use token to fetch user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = await userRes.json();

    res.status(200).json({
      message: "Google Authentication Successful",
      user: userInfo,
    });
  } catch (err) {
    console.error("Google OAuth Error:", err.message);
    res.status(500).json({ error: "OAuth failed", details: err.message });
  }
}

export async function linkedinAuthorization(req, res) {
  try {
    const { code, redirectUri } = req.body;

    // Step 1: Exchange code for access token
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;
    // console.log("hello " , tokenData);
    

    if (!access_token) {
      return res.status(400).json({ message: "LinkedIn token fetch failed" });
    }

    // Step 2: Fetch LinkedIn profile
    const [profileRes, emailRes] = await Promise.all([
      fetch("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
      fetch("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
        headers: { Authorization: `Bearer ${access_token}` },
      }),
    ]);

    const profile = await profileRes.json();
    const emailData = await emailRes.json();
    const email = emailData.elements?.[0]?.["handle~"]?.emailAddress;

    return res.status(200).json({
      message: "LinkedIn Auth Successful",
      user: {
        id: profile.id,
        name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
        email,
      },
    });
  } catch (err) {
    console.error("LinkedIn Auth Error:", err.message);
    res.status(500).json({ error: "LinkedIn OAuth failed", details: err.message });
  }
}



