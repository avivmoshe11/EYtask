const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Access denied, no token provided");
  }
  try {
    const payload = jwt.verify(token, config.get("jwtkey"));
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).send("invalid token");
  }
}

module.exports = auth;
