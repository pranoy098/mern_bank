const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const usersSchema = require("../model/users.model");

router.get("/", (req, res) => {
  controller.getData(req, res, usersSchema);
});

router.post("/", (req, res) => {
  controller.createData(req, res, usersSchema);
});

module.exports = router;
