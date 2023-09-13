const jwt = require("jsonwebtoken");
const User = require("../service/schemas/userSchema");
const jwtKey = process.env.JWT_SECRET_KEY;

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization.slice(7);
  try {
    if (!token) {
      throw new Error();
    }
    const decodedToken = jwt.verify(token, jwtKey);
    const user = await User.findById(decodedToken.id);
    if (!user || user.token !== token) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "Unauthorized",
      code: 401,
      message: error.message || "Not authorized",
    });
  }
};
module.exports = authenticate;
