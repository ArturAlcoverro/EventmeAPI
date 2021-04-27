const conn = require("../database/connection");
let bcrypt = require("bcrypt");

async function insert(user) {
    const [resultado] = await conn
        .promise()
        .query("INSERT INTO users SET ?", user);

    user.id = resultado.insertId;
    delete user.password;
    return user;
}

async function getUserByEmail (email, next){
    let users
    try {
        [users] = await conn.promise().query(`SELECT * FROM users where email = ?`, [email]);
    } catch (ex) {
        return next({
            status: 500,
            error: "Error en la base de datos",
            trace: "ex",
        });
    }
    if (!users[0]) return next({ status: 404, error: "Recurso no encontrado" });
    return users[0];
}

async function login(req, res, next) {
    try {
        let user = await getUserByEmail(req.body.email, next)
        bcrypt.compare(req.body.password, user.password, (error, result) => {
            if (error) return next({ status: 404, error: "Recurso no encontrado" });
            if (!result) return next({ status: 404, error: "Recurso no encontrado" });

            delete user.password;

            const jwt = require("jsonwebtoken");
            const token = jwt.sign(
                JSON.stringify(user),
                process.env.ACCESS_TOKEN_SECRET
            );
            res.json({ token });
        });
    } catch (error) {
        next({ status: 500, error: "Recurso no encontrado", stacktrace: error });
    }
}

async function register(req, res, next) {
    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;

    bcrypt.hash(myPlaintextPassword, saltRounds, async (err, hash) => {
        if (err)
            next({
                status: 500,
                error: "error al encriptar el password",
                trace: err,
            });
        req.body.password = hash;
        try {
            const response = await insert(req.body);
            res.json(response);
        } catch (ex) {
            next({ status: 500, error: "error al insertar el usuario", trace: ex });
        }
    });
}

module.exports = { login, register };
