const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const verifyToken = require("../../middlewares/auth/verifyToken");

router.get("/me", verifyToken, userController.me);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/preferences/user/:id", verifyToken, userController.updatePreferences);
router.delete("/delete/:id", verifyToken, userController.deleteUser);

router.post("/choose-trainer", userController.selectTrainer);

module.exports = router;