const dbService = require("../services/db.service");
const createData = async (req, res, schema) => {
  try {
    const data = req.body;
    const dbRes = await dbService.createNewRecord(data, schema);
    res.status(200).json({
      message: "Data inserted successfully",
      sucess: true,
      data: dbRes,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(422).json({
        message: "Already exists!",
        success: false,
        err,
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
};

module.exports = {
  createData,
};
