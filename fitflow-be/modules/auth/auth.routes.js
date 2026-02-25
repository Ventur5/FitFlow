const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "http://localhost:5173/login", 
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

    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("http://localhost:5173/");
  });
});

module.exports = router;