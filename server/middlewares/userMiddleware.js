const _ = require("lodash");
const Boom = require("boom");
const Moment = require("moment");
const jwt = require("jsonwebtoken");

const generalHelper = require("../helpers/generalHelper");

const fileName = "./server/middlewares/userMiddleware.js";
const jwtSecretToken = process.env.JWT_SECRET_TOKEN || "MUSIC_SERVICE_KEY";

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (_.isEmpty(authorization)) throw Boom.unauthorized();

    const token = authorization.split(" ")[1];
    const verifiedUser = jwt.verify(token, jwtSecretToken);
    if (_.isEmpty(verifiedUser) || !_.has(verifiedUser, "exp")) {
      throw Boom.unauthorized();
    }

    const isTokenExpired = verifiedUser.exp < Moment().unix();
    if (isTokenExpired) throw Boom.unauthorized();

    req.userData = { username: verifiedUser.username };

    return next();
  } catch (err) {
    console.log(fileName, "Token Validation", "ERROR", { info: err });
    return res.send(generalHelper.errorResponse(err));
  }
};

module.exports = {
  tokenValidation,
};
