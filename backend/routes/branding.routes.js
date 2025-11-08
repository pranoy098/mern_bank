const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const brandingSchema = require("../model/branding.model");

router.get("/", (req, res) => {
  controller.getData(req, res, brandingSchema);
});

router.post("/", (req, res) => {
  controller.createData(req, res, brandingSchema);
});

router.put("/:id", (req, res) => {
  controller.updateData(req, res, brandingSchema);
});

module.exports = router;
