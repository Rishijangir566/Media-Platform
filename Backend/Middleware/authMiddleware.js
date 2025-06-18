import jwt from "jsonwebtoken";
import Register from "../Models/register.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      //   req.user = await Register.findById(decoded.id).select("-password");

      const user = await Register.findById(decoded.id).select("-password");
      console.log(user);

      // 3. Attach user info to the request object so other routes can use it
      req.user = user;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
