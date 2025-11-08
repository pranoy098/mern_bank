const dbService = require("../services/db.service");

const getData = async (req, res, schema) => {
  try {
    const dbRes = await dbService.findAllRecord(schema);
    return res.status(200).json({
      message: "Record found",
      data: dbRes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

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

const updateData = async (req, res, schema) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const dbRes = await dbService.updateRecord(id, data, schema);
    return res.status(200).json({
      message: "Record updated successfully",
      data: dbRes,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err,
    });
  }
};

const deleteData = async (req, res, schema) => {
  try {
    const { id } = req.params;
    const dbRes = await dbService.deleteRecord(id, schema);
    return res.status(200).json({
      message: "Record deleted",
      data: dbRes,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      err,
    });
  }
};

module.exports = {
  createData,
  getData,
  updateData,
  deleteData,
};
