const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/constants");

const checkAuth = (req, res, next) => {
  // console.log(req.cookies.token);
  const  token  = req.cookies.token ?? req.headers.token;
  try {
    const user = jwt.verify(token, JWT_SECRET_KEY);
    req.authUser = user;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Unauthorized",
    });
  }
};

const checkAuthAdmin = (req, res, next) => {
  const  token  = req.cookies.token ?? req.headers;
  try {
    const user = jwt.verify(token, JWT_SECRET_KEY);
    if (!user.roles.includes("Admin")) {
      res.status(401).json({
        message: "Unauthorized access",
      });
      return;
    }
    req.authUser = user;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Unauthorized access",
      data: error.message,
    });
  }
};

module.exports = {
  checkAuth,
  checkAuthAdmin,
};
