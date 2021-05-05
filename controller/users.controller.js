const conn = require("../database/connection");

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

async function update(req, res, next) {
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        if (err)
            return next({
                status: 500,
                error: "error al encriptar la contraseña",
                trace: err,
            });
        req.body.password = hash;
        console.log(req.body)
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
                    status: 500,
                    error: `error al modificar el usuario`,
                    trace: err
                });
            })
    });
}

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
