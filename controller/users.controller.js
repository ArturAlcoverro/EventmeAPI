/** Users controller
 * @module controller/users
 */

const conn = require("../database/connection");
const { uploadImage } = require("../upload")

/**
 * Endpoint que busca todos los usuarios a traves 
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function search(req, res, next) {
    const like = `%${req.query.s}%`

    console.log(like)
    conn.promise()
        .query(`
            SELECT id, name, last_name, image, email FROM users
            WHERE users.name LIKE ?
            OR users.last_name LIKE ?
            OR users.email LIKE ?`
            , [like, like, like])
        .then(([users]) => {
            res.json(users)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function get(req, res, next) {
    conn.promise()
        .query(`SELECT id, name, last_name, image, email FROM users`)
        .then(([users]) => {
            res.json(users)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function update(req, res, next) { 
    const bcrypt = require("bcrypt");
    const salt = 10;
    let image = ""

    if (req.files && req.files.image)
        image = req.files.image

    uploadImage(image, (imageName, err) => {
        if (err) return next({
            status: 400,
            error: err
        })

        if (imageName) req.body.image = imageName
        
        bcrypt.hash(req.body.password, salt, async function (err, hash) {
            if (err)
                return next({
                    status: 409,
                    error: "error al encriptar la contrase??a",
                    trace: err,
                });
            req.body.password = hash;
            conn.promise()
                .query(`
                    UPDATE users 
                    SET ?
                    WHERE users.id = ?
                `, [req.body, req.USER.id])
                .then(([users]) => {
                    res.json(users)
                })
                .catch(err => {
                    return next({
                        status: 409,
                        error: `Error al modificar el usuario`,
                        trace: err
                    });
                })
        });
    })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function del(req, res, next) {
    conn.promise()
        .query(`
            DELETE FROM users
            WHERE users.id = ?
        `, [req.USER.id])
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getById(req, res, next) {
    conn.promise()
        .query(` 
            SELECT id, name, last_name, image, email FROM users
            WHERE users.id = ?
        `, [req.params.ID])
        .then(([users]) => {
            res.json(users[0])
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getEvents(req, res, next) {
    conn.promise()
        .query(`
            SELECT * FROM events
            WHERE owner_id = ?
        `, [req.params.ID])
        .then(([events]) => {
            res.json(events)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getFutureEvents(req, res, next) {
    conn.promise()
        .query(`
            SELECT * FROM events
            WHERE owner_id = ?
            AND eventStart_date >= CURRENT_TIMESTAMP
        `, [req.params.ID])
        .then(([events]) => {
            res.json(events)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getFinishedEvents(req, res, next) {
    conn.promise()
        .query(`
            SELECT * FROM events
            WHERE owner_id = ?
            AND eventEnd_date <= CURRENT_TIMESTAMP
        `, [req.params.ID])
        .then(([events]) => {
            res.json(events)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getCurrentEvents(req, res, next) {
    conn.promise()
        .query(`
            SELECT * FROM events
            WHERE owner_id = ?
            AND eventStart_date <= CURRENT_TIMESTAMP
            AND eventEnd_date >= CURRENT_TIMESTAMP
        `, [req.params.ID])
        .then(([events]) => {
            res.json(events)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

/**
 * Endpoint que busca todos los usuarios a traves
 * del nombre, apellido y correo electronico
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function getAssistance(req, res, next) {
    conn.promise()
        .query(`
            SELECT e.*, a.comentary, a.puntuation
            FROM assistance AS a 
            INNER JOIN events AS e
            ON e.id = a.event_id
            WHERE a.user_id = ?
        `, [req.params.ID])
        .then(([events]) => {
            res.json(events)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

async function getFutureAssistance(req, res, next) {
    conn.promise()
        .query(`
            SELECT e.*, a.comentary, a.puntuation
            FROM assistance AS a 
            INNER JOIN events AS e
            ON e.id = a.event_id
            WHERE a.user_id = ?
            AND e.eventStart_date >= CURRENT_TIMESTAMP
        `, [req.params.ID])
        .then(([events]) => {
            res.json(events)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

async function getFinishedAssistance(req, res, next) {
    conn.promise()
        .query(`
            SELECT e.*, a.comentary, a.puntuation
            FROM assistance AS a 
            INNER JOIN events AS e
            ON e.id = a.event_id
            WHERE a.user_id = ?
            AND e.eventEnd_date <= CURRENT_TIMESTAMP
        `, [req.params.ID])
        .then(([events]) => {
            res.json(events)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

async function getFriends(req, res, next) {
    const id = req.params.ID
    conn.promise()
        .query(`
            SELECT u.id, u.name, u.last_name, u.email, u.image
            FROM friends AS f
            INNER JOIN users AS u
            ON f.user_id = u.id 
            OR f.user_id_friend = u.id
            WHERE f.status = 1
            AND (f.user_id = ? OR f.user_id_friend = ?)
            AND u.id <> ?
        `, [id, id, id])
        .then(([events]) => {
            res.json(events)
        })
        .catch(err => {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        })
}

module.exports = {
    search,
    get,
    update,
    del,
    getById,
    getEvents,
    getFutureEvents,
    getFinishedEvents,
    getCurrentEvents,
    getAssistance,
    getFutureAssistance,
    getFinishedAssistance,
    getFriends
};
