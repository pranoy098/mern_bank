const express = require("express");
const router = express.Router();

const uploadController = require("../controller/upload.controller");
const upload = require("../services/upload.service");

router.post("/", upload.single("file"), uploadController.uploadFile);

module.exports = router;
