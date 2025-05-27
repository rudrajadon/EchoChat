import jwt from "jsonwebtoken";

// generate JSON Web Token (JWT) and set it as an HTTP-only cookie
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,                // 7 days in milliseconds (ms)
    httpOnly: true,                                 // HTTP-only to prevent Cross-Site Scripting (XSS) attacks
    sameSite: "strict",                             // Strict SameSite to prevent Cross-Site Request Forgery (CSRF) attacks
    secure: process.env.NODE_ENV !== "development", // only send cookie over HTTPS in production
  });

  return token;
};
