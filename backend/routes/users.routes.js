const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const usersSchema = require("../model/users.model");
const { verifyToken, isAdmin } = require("../middlewares/middleware");

router.get("/", verifyToken, isAdmin, (req, res) => {
  controller.getData(req, res, usersSchema);
});

router.post("/", verifyToken, isAdmin, (req, res) => {
  controller.createData(req, res, usersSchema);
});

router.put("/:id", verifyToken, isAdmin, (req, res) => {
  controller.updateData(req, res, usersSchema);
});

router.delete("/:id", verifyToken, isAdmin, (req, res) => {
  controller.deleteData(req, res, usersSchema);
});

module.exports = router;
