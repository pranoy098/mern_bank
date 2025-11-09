const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const currencySchema = require("../model/currency.model");

router.get("/", (req, res) => {
  controller.getData(req, res, currencySchema);
});

router.post("/", (req, res) => {
  controller.createData(req, res, currencySchema);
});

router.put("/:id", (req, res) => {
  controller.updateData(req, res, currencySchema);
});

router.delete("/:id", (req, res) => {
  controller.deleteData(req, res, currencySchema);
});

module.exports = router;
