const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: `${FRONTEND_URL}/login`,
    session: false 
  }),
  (req, res) => {
    const payload = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(`${FRONTEND_URL}/`);
  });
});

module.exports = router;