const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../users/auth.middleware");

router.get("/me", authMiddleware, userController.me);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/preferences/user/:id", authMiddleware, userController.updatePreferences);
router.delete("/delete/:id", authMiddleware, userController.deleteUser);

router.post("/choose-trainer", userController.selectTrainer);

module.exports = router;