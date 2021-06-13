/** Events controller
 * @module controller/events
 */

const conn = require("../database/connection");
const { uploadImage } = require("../upload")

/**
 * Endpoint que inserta un evento en la BBDD
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function create(req, res, next) {
    let image = ""

    if (req.files && req.files.image)
        image = req.files.image

    //Función que sube la imagen recibida al servidor
    uploadImage(image, async function (imageName, err) {
        if (err) return next({
            status: 400,
            error: err
        })

        if (imageName) req.body.image = imageName
        req.body.owner_id = req.USER.id;

        try {
            const [result] = await conn.promise()
                .query(`INSERT INTO events SET ?`, [req.body])

            const [event] = await conn.promise()
                .query(`SELECT * FROM events WHERE id = ?`, [result.insertId])

            res.status(201).json(event[0])
        }
        catch (err) {
            return next({
                status: 500,
                error: `Server error`,
                trace: err
            });
        }
    })
}

/**
 * Endpoint de devuelve todos los eventos de la BBDD
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function get(req, res, next) {
    conn.promise()
        .query(`SELECT * FROM events`)
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
 * Endpoint que devuelve el evento de la ID recibida en la request
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function getByID(req, res, next) {
    conn.promise()
        .query(`SELECT * FROM events WHERE id = ?`, [req.params.ID])
        .then(([event]) => {
            res.json(event[0])
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
 * Endpoint que actualiza un evento existente
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function update(req, res, next) {
    let image = ""

    if (req.files && req.files.image)
        image = req.files.image

    //Función que sube la imagen recibida al servidor
    uploadImage(image, async function (imageName, err) {
        if (err) return next({
            status: 400,
            error: err
        })

        if (imageName) req.body.image = imageName

        try {
            const [event] = await conn.promise()
                .query(`SELECT owner_id FROM events WHERE id = ?`, [req.params.ID])

            if (event[0].owner_id !== req.USER.id)
                return next({ status: 403, error: `You do not have permission to update this event` });

            const [result] = await conn.promise()
                .query(`UPDATE events SET ? WHERE id = ?`, [req.body, req.params.ID])

            const [updatedEvent] = await conn.promise()
                .query(`SELECT * FROM events WHERE id = ?`, [req.params.ID])

            res.status(200).json(updatedEvent[0])
        }
        catch (err) {
            return next({
                status: 409,
                error: `The event could not be updated`,
                trace: err
            });
        }
    })

}

/**
 * Endpoint que elimina el evento con la ID recibida en la request
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function del(req, res, next) {
    try {
        const [event] = await conn.promise()
            .query(`SELECT owner_id FROM events WHERE id = ?`, [req.params.ID])

        if (event[0].owner_id !== req.USER.id)
            return next({ status: 403, error: `You do not have permission to delete this event` });

        const [result] = await conn.promise()
            .query(`DELETE FROM events WHERE id = ?`, [result.insertId])

        res.status(204).send()
    }
    catch (err) {
        return next({
            status: 500,
            error: `Server error`,
            trace: err
        });
    }
}

/**
 * Endpoint que devuelve todos los usuarios apuntados al evento
 * con la ID recibida en la request
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function getAssistances(req, res, next) {
    conn.promise()
        .query(`
            SELECT u.id, u.name, u.last_name, u.email, u.image, a.puntuation, a.comentary 
            FROM assistance AS a
            INNER JOIN users AS u 
            ON u.id = a.user_id
            WHERE a.event_id = ?
        `, [req.params.ID])
        .then(([assistances]) => {
            res.json(assistances)
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
 * Endpoint que devuelve la assistencia de un usuario concreto a un evento concreto
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function getAssistancesByUser(req, res, next) {
    conn.promise()
        .query(`
            SELECT * FROM assistance
            WHERE event_id = ?
            AND user_id = ?
        `, [req.params.ID, req.params.ID_USER])
        .then(([assistance]) => {
            res.json(assistance[0])
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
 * Endpoint que crea una asistencia a un evento al usuario autenticado
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function createAssistance(req, res, next) {
    conn.promise()
        .query(`
            INSERT INTO assistance
            SET user_id = ?,
            event_id = ?,
            puntuation = ?,
            comentary = ?
        `, [req.USER.id, req.params.ID, req.body.puntuation, req.body.comentary])
        .then(() => {
            res.json({
                user_id: req.USER.id,
                event_id: parseInt(req.params.ID, 10),
                puntuation: req.body.puntuation,
                comentary: req.body.comentary
            })
        })
        .catch(err => {
            return next({
                status: 409,
                error: `Could not insert the assistance correctly`,
                trace: err
            });
        })
}

/**
 * Endpoint que actualitza la assistencia del usuario autenticado 
 * para el evento con la ID recibida en la request
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function updateAssistance(req, res, next) {
    conn.promise()
        .query(`
            UPDATE assistance
            SET puntuation = ?,
            comentary = ?
            WHERE user_id = ? 
            AND event_id = ?
        `, [req.body.puntuation, req.body.comentary, req.USER.id, req.params.ID])
        .then(() => {
            res.status(201).json({
                user_id: req.USER.id,
                event_id: parseInt(req.params.ID, 10),
                puntuation: req.body.puntuation,
                comentary: req.body.comentary
            })
        })
        .catch(err => {
            return next({
                status: 409,
                error: `Could not insert the assistance correctly`,
                trace: err
            });
        })
}

/**
 * Endpoint que elimina la asistencia del usuario autenticado
 * para el evento con la ID recibida en la request
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function deleteAssistance(req, res, next) {
    conn.promise()
        .query(`
            DELETE FROM assistance
            WHERE user_id = ? 
            AND event_id = ?
        `, [req.USER.id, req.params.ID])
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

module.exports = {
    create,
    get,
    getByID,
    update,
    del,
    getAssistances,
    getAssistancesByUser,
    createAssistance,
    updateAssistance,
    deleteAssistance
}