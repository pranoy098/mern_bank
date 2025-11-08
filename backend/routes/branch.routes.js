const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const branchSchema = require("../model/branch.model");

router.get("/", (req, res) => {
  controller.getData(req, res, branchSchema);
});

router.post("/", (req, res) => {
  controller.createData(req, res, branchSchema);
});

router.put("/:id", (req, res) => {
  controller.updateData(req, res, branchSchema);
});

router.delete("/:id", (req, res) => {
  controller.deleteData(req, res, branchSchema);
});

module.exports = router;
