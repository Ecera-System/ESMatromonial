import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "../config/passport.js";

const googleRouter = express.Router();

googleRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Issue JWT and redirect or respond with token
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET || "yoursecret",
      { expiresIn: "7d" }
    );
    // For SPA: send token as JSON or redirect with token in query
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    // Or: res.json({ token, user: req.user });
  }
);

export default googleRouter;
