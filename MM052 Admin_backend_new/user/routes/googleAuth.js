import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "../../config/passport.js";

const googleRouter = express.Router();

googleRouter.get(
  "/google",
  (req, res, next) => {
    console.log('🔐 Google OAuth initiated');
    console.log('📝 Query params:', req.query);
    console.log('🌐 Environment check:', {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'Not set'
    });
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRouter.get(
  "/google/callback",
  (req, res, next) => {
    console.log('🔄 Google OAuth callback received');
    console.log('📝 Callback query params:', req.query);
    console.log('🔗 Full callback URL:', req.originalUrl);
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: (req, res) => {
      console.log('❌ Google OAuth failed');
      const redirectUrl = req.query.redirect || (process.env.CLIENT_URL || "http://localhost:5173") + "/login";
      const errorUrl = `${redirectUrl}?error=oauth_failed`;
      console.log('🔄 Redirecting to error URL:', errorUrl);
      res.redirect(errorUrl);
    },
  }),
  (req, res) => {
    try {
      console.log('✅ Google OAuth successful, user:', req.user);
      
      if (!req.user) {
        console.error('❌ No user object found after authentication');
        const redirectUrl = req.query.redirect || (process.env.CLIENT_URL || "http://localhost:5173") + "/login";
        const errorUrl = `${redirectUrl}?error=no_user`;
        return res.redirect(errorUrl);
      }
      
      // Issue JWT and redirect or respond with token
      const token = jwt.sign(
        { 
          id: req.user._id, 
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName
        },
        process.env.JWT_SECRET || "yoursecret",
        { expiresIn: "7d" }
      );
      
      // Get redirect URL from query params or default to frontend
      const redirectUrl = req.query.redirect || (process.env.CLIENT_URL || "http://localhost:5173") + "/login";
      const successUrl = `${redirectUrl}?token=${token}&success=true`;
      
      console.log('✅ Google OAuth successful, redirecting with token');
      console.log('🔄 Success URL:', successUrl);
      res.redirect(successUrl);
    } catch (error) {
      console.error('❌ Error in Google OAuth callback:', error);
      const redirectUrl = req.query.redirect || (process.env.CLIENT_URL || "http://localhost:5173") + "/login";
      const errorUrl = `${redirectUrl}?error=oauth_failed&message=${encodeURIComponent(error.message)}`;
      res.redirect(errorUrl);
    }
  }
);

export default googleRouter;
