const jsonwebtoken = require("jsonwebtoken");

function ensureLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jsonwebtoken.verify(token, "SECRET");
    return next();
  } catch (err) {
    return res.json({
      message: "Unauthorized"
    });
  }
}

function ensureCorrectUser(req, res, next) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jsonwebtoken.verify(token, "SECRET");
    if (decodedToken.user_id === +req.params.id) {
      return next();
    } else {
      return res.json({
        message: "Unauthorized"
      });
    }
    return next();
  } catch (err) {
    return res.json({
      message: "Unauthorized"
    });
  }
}

module.exports = {
  ensureCorrectUser,
  ensureLoggedIn
};
