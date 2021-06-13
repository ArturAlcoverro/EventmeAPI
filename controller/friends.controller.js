/** Friends controller
 * @module controller/friends
 */

const conn = require("../database/connection");

/**
 * Endpoint que devuelve las peticiones de amistad
 * enviadas al usuario autenticado 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function getRequests(req, res, next) {
    conn.promise()
        .query(`
            SELECT u.id, u.name, u.last_name, u.image, u.email
            FROM users AS u
            INNER JOIN friends AS f
            ON f.user_id = u.id
            AND f.status = 0
            WHERE f.user_id_friend = ?
        `, [req.USER.id])
        .then(([requests]) => {
            res.json(requests)
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
 * Endpoint que devuelve todas las amistades del usuario autenticado
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function get(req, res, next) {
    conn.promise()
        .query(`
            SELECT u.id, u.name, u.last_name, u.image, u.email
            FROM users AS u
            INNER JOIN friends AS f
            ON ((f.user_id = u.id AND f.user_id_friend = ?)
            OR (f.user_id_friend = u.id AND f.user_id = ?))
            AND f.status = 1
        `, [req.USER.id, req.USER.id])
        .then(([requests]) => {
            res.json(requests)
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
 * Endpoint que inserta una peticion de amistad a la BBDD
 * del usuario autenticado hacia el usuario con la ID recibida en la request
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function request(req, res, next) {
    conn.promise()
        .query(`
            INSERT INTO friends
            SET user_id = ?,
            user_id_friend = ?,
            status = 0
        `, [req.USER.id, req.params.ID])
        .then(() => {
            res.status(204).send()
        })
        .catch(err => {
            return next({
                status: 409,
                error: `The request could not be sent`,
                trace: err
            });
        })
}

/**
 * Endpoint que accepta una peticion de amistad (status 1)
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function accept(req, res, next) {
    conn.promise()
        .query(`
            UPDATE friends
            SET status = 1
            WHERE user_id = ?
            AND user_id_friend = ?
        `, [req.USER.id, req.params.ID])
        .then(([result]) => {
            if (result.affectedRows < 1)
                return next({
                    status: 409,
                    error: `This request does not exist`,
                })
            res.status(204).send()
        })
        .catch(err => {
            return next({
                status: 409,
                error: `The request could not be accepted`,
                trace: err
            });
        })
}

/**
 * Endpoint que elimina una peticion de amistad (la deniega)
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function del(req, res, next) {
    conn.promise()
        .query(`
            DELETE FROM friends
            WHERE user_id = ? AND user_id_friend = ?
            OR user_id = ? AND user_id_friend = ?
        `, [req.USER.id, req.params.ID, req.params.ID, req.USER.id])
        .then(([result]) => {
            if (result.affectedRows < 1)
                return next({
                    status: 409,
                    error: `This request does not exist`,
                })
            res.status(200).json(result)
        })
        .catch(err => {
            return next({
                status: 409,
                error: `The request could not be deleted`,
                trace: err
            });
        })
}

module.exports = {
    getRequests,
    get,
    request,
    accept,
    del
}