const { User } = require("../models/users");

async function isAdmin(req, res, next) {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(403).send("Access denied, forbidden");
  }
  if (user.admin) {
    next();
  } else {
    return res.status(403).send("Access denied, forbidden");
  }
}

module.exports = isAdmin;
