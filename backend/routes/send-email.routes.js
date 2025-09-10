const express = require("express");
const router = express.Router();

const emailController = require("../controller/email.controller");

router.post("/", emailController.sendEmail);
module.exports = router;
