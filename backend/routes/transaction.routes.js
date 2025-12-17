const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const transactionSchema = require("../model/transaction.model");
const { verify } = require("jsonwebtoken");
const {
  verifyToken,
  isAdmin,
  isAdminEmployee,
  isAdminEmployeeCustomer,
} = require("../middlewares/middleware");

router.get("/", (req, res) => {
  controller.getData(req, res, transactionSchema);
});

router.get("/summary", verifyToken, isAdminEmployeeCustomer, (req, res) => {
  controller.getTransactionSummary(req, res, transactionSchema);
});

router.get("/pagination", verifyToken, isAdminEmployeeCustomer, (req, res) => {
  controller.getPaginatedTransactions(req, res, transactionSchema);
});

router.post("/", verifyToken, isAdminEmployee, (req, res) => {
  controller.createData(req, res, transactionSchema);
});

router.post("/filter", (req, res) => {
  controller.filterData(req, res, transactionSchema);
});

router.put("/:id", (req, res) => {
  controller.updateData(req, res, transactionSchema);
});

router.delete("/:id", (req, res) => {
  controller.deleteData(req, res, transactionSchema);
});

module.exports = router;
