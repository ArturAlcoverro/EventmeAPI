/** Users authentication controller
 * @module controller/auth
 */

const conn = require("../database/connection");
const bcrypt = require("bcrypt");
const { uploadImage } = require("../upload")

/**
 * Inserta un usuario a la BBDD
 * @param {User} user 
 * @returns el usuario sin contrasenya
 * @memberof module:controller/auth
 */
async function insert(user) {
    const [resultado] = await conn
        .promise()
        .query("INSERT INTO users SET ?", user);

    user.id = resultado.insertId;
    delete user.password;
    return user;
}

/**
 * Obtiene un usuario de la BBDD a partir de un email
 * @param {String} email 
 * @param {express.NextFunction} next 
 * @returns el usuario
 * @memberof module:controller/auth
 */
async function getUserByEmail(email, next) {
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

/**
 * Endpoint que valida el login i devuelve el token
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns token
 * @memberof module:controller/auth
 */
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
            res.json({ accessToken: token });
        });
    } catch (error) {
        return next({ status: 500, error: "Recurso no encontrado", stacktrace: error });
    }
}

/**
 * Endpoint que registra un nuevo usuario a la BBDD
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @memberof module:controller/auth
 */
async function register(req, res, next) {
    let image = ""
    if (req.files && req.files.image)
        image = req.files.image
    uploadImage(image, (imageName, err) => {
        const salt = 10;
        const myPlaintextPassword = req.body.password;

        if (imageName) req.body.image = imageName
        if (err) return next({
            status: 400,
            error: err
        })

        bcrypt.hash(myPlaintextPassword, salt, async function (err, hash) {
            if (err)
                return next({
                    status: 500,
                    error: "error al encriptar el password",
                    trace: err,
                });
            console.log(hash)
            req.body.password = hash;
            try {
                const response = await insert(req.body);
                res.status(201).json(response);
            } catch (ex) {
                return next({ status: 500, error: "error al insertar el usuario", trace: ex });
            }
        })
    })
}

module.exports = { login, register };
