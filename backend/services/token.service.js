require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("token", token);
  if (!token) {
    return { message: "No token provided", isValid: false };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { message: "Token verified !", isVerified: true, data: decoded };
  } catch (err) {
    return { message: "No token provided", isValid: false, err };
  }
};

module.exports = { verifyToken };
