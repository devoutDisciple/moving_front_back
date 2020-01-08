const express = require("express");
const router = express.Router();
const optionService = require("../services/optionService");

router.post("/add", (req, res) => {
	optionService.add(req, res);
});


module.exports = router;
