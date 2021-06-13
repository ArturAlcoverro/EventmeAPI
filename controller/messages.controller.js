/** Messages controller
 * @module controller/messages
 */

const conn = require("../database/connection");

/**
 * Endpoint que inserta un mensaje las IDs reicibidas en la request
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function create(req, res, next) {
    if (req.USER.id != req.body.user_id_send)
        return next({
            status: 403,
            error: `You do not have permission to send this message`,
        });
    conn.promise()
        .query(`
            INSERT INTO messages
            SET ?
        `, [req.body])
        .then(([result]) => {
            res.status(204).send()
        })
        .catch(err => {
            return next({
                status: 409,
                error: `The message could not be sent`,
                trace: err
            });
        })
}

/**
 * Endpoint que devuelve los usuarios que han enviado un mensaje
 * al usuarios autenticado
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function getUsers(req, res, next) {
    conn.promise()
        .query(`
            SELECT u.id, u.name, u.last_name, u.email
            FROM users AS u
            INNER JOIN messages AS m
            ON m.user_id_send = u.id
            WHERE m.user_id_recived = ?
            GROUP BY u.id
        `, [req.USER.id])
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
 * Endpoint de devuelve toda la conversacion entre el usuario autenticado
* y el usuario con la ID recibida en la request
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function getByUser(req, res, next) {
    conn.promise()
        .query(`
            SELECT * FROM messages 
            WHERE user_id_send = ? 
            AND user_id_recived = ?
            OR user_id_send = ? 
            AND user_id_recived = ?
        `, [req.USER.id, req.params.USER_ID, req.params.USER_ID, req.USER.id])
        .then(([messages]) => {
            res.json(messages)
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
    create,
    getUsers,
    getByUser
}
