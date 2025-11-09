require("dotenv").config();
const dbService = require("../services/db.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginFunc = async (req, res, schema) => {
  try {
    const { email, password } = req.body;
    const query = {
      email,
    };
    const dbRes = await dbService.findOneRecord(query, schema);
    console.log("DB Response:", dbRes);
    if (dbRes) {
      const isMatch = await bcrypt.compare(password, dbRes.password);
      console.log("Password Match:", isMatch);
      if (isMatch) {
        if (dbRes.isActive) {
          delete dbRes._doc.password; // Remove password before sending response
          const payload = {
            ...dbRes._doc,
            _id: dbRes._id.toString(),
          };
          const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3h",
          });

          return res.status(200).json({
            message: "Login successful",
            isLogged: true,
            token,
            userType: dbRes._doc.userType,
          });
        }
      } else {
        return res.status(401).json({
          message: "Invalid credentials",
          isLogged: false,
        });
      }
    } else {
      return res.status(401).json({
        message: "Invalid credentials",
        isLogged: false,
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      isLogged: false,
      error,
    });
  }
};

module.exports = {
  loginFunc,
};
