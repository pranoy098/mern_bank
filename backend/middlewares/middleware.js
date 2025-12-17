const jwt = require("jsonwebtoken");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

const verifyToken = (req, res, next) => {
  try {
    const origin = req.headers.origin;
    console.log(origin);
    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Token missing." });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Allow Admin
const isAdmin = (req, res, next) => {
  if (req.user?.userType === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

// Allow Admin or Employee
const isAdminEmployee = (req, res, next) => {
  if (["admin", "employee"].includes(req.user?.userType)) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

// Allow Admin or Employee or Customer
const isAdminEmployeeCustomer = (req, res, next) => {
  if (["admin", "employee", "customer"].includes(req.user?.userType)) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

module.exports = {
  verifyToken,
  isAdmin,
  isAdminEmployee,
  isAdminEmployeeCustomer,
};
