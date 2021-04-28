const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  //verificar si el usuario aun existe
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1]; //returns or undenifed or the token

  if (token == null)
    return next({
      status: "401",
      error: "No estas autenticado",
      hint: "Has probado a hacer login? http://localhost:3000/login",
    });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return next({
        status: "401",
        error: "No estas autenticado",
        stack: err,
      });

    // guardo el usuario en la request.
    req.USER = user;

    next();
  });
}

module.exports = authenticate;
