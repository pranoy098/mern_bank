const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const customersSchema = require("../model/customers.model");

router.post("/", async (req, res) => {
  controller.findByAccountNo(req, res, customersSchema);
});

module.exports = router;
