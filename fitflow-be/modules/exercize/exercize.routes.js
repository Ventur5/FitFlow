const express = require("express");
const router = express.Router();
const exercizeController = require("./exercize.controller");

router.get("/recommendation", exercizeController.getRecommendations);

module.exports = router;
