const { verifyToken } = require("./verifyToken");

exports.adminAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin === true) {
      next();
    }
  });
};
