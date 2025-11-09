const express = require("express");
const router = express.Router();
const loginController = require("../controller/login.controller");
const usersSchema = require("../model/users.model");

router.post("/", (req, res) => {
  loginController.loginFunc(req, res, usersSchema);
});

module.exports = router;
