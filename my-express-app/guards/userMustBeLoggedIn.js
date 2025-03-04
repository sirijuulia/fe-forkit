const jwt = require("jsonwebtoken");
require("dotenv").config();
const supersecret = process.env.SUPER_SECRET;

async function userMustBeLoggedIn(
  req,
  res,
  next
) {
  const token = req.headers[
    "authorization"
  ]?.replace(/^Bearer\s/, "");
  console.log(token);
  if (!token) {
    res.status(401).send({
      message: "please provide a token",
    });
  } else {
    await jwt.verify(
      token,
      supersecret,
      function (err, decoded) {
        if (err)
          res
            .status(401)
            .send({ message: err.message });
        else {
          req.user_id = decoded.user_id;
          next();
        }
      }
    );
  }
}

module.exports = userMustBeLoggedIn;
