const jwt = require("jsonwebtoken");
const conn = require("./database/connection");

function authenticate(req, res, next) {
  //verificar si el usuario aun existe
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1]; //returns or undenifed or the token

  if (token == null)
    return next({
      status: "401",
      error: "No estas autenticado",
    });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return next({
        status: "401",
        error: "No estas autenticado",
        trace: err,
      });

    conn.promise()
      .query(`SELECT id FROM users WHERE id = ?`
        , [user.id])
      .then(([users]) => {
        if (users.length === 0) {
          next({
            status: "401",
            error: "No estas autenticado",
          });
        }
        req.USER = user;
        next();
      })
      .catch(err => {
        next({
          status: 500,
          error: `Server error`,
          trace: err
        });
      })
  });
}

module.exports = authenticate;
