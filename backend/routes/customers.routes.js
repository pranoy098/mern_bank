const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const customersSchema = require("../model/customers.model");

router.get("/", (req, res) => {
  controller.getData(req, res, customersSchema);
});

router.post("/", (req, res) => {
  controller.createData(req, res, customersSchema);
});

router.put("/:id", (req, res) => {
  controller.updateData(req, res, customersSchema);
});

router.delete("/:id", (req, res) => {
  controller.deleteData(req, res, customersSchema);
});

module.exports = router;
