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
            if (users.length === 0) {
                next({ status: 404, error: `users not found` });
            }
            res.json(users)
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function get(req, res, next) {
    conn.promise()
        .query(`SELECT id, name, last_name, image, email FROM users`)
        .then(([users]) => {
            if (users.length === 0) {
                next({ status: 404, error: `users not found` });
            }
            res.json(users)
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function update(req, res, next) {

}

async function del(req, res, next) {

}

async function getById(req, res, next) {
    conn.promise()
        .query(`
            SELECT id, name, last_name, image, email FROM users
            WHERE users.id = ?
        `, [req.params.ID])
        .then(([users]) => {
            if (users.length === 0) {
                next({ status: 404, error: `users not found` });
            }
            res.json(users[0])
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function getEvents(req, res, next) {
    const id = req.params.ID
    console.log(id)

    conn.promise()
        .query(`
            SELECT * FROM events
            WHERE owner_id = ?
        `, [id])
        .then(([events])=>{
            if (events.length === 0) {
                next({ status: 404, error: `events not found` });
            }
            res.json(events)
        })
        .catch(err=>{
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function getFutureEvents(req, res, next) {
    const id = req.params.ID
    console.log(id)

    conn.promise()
        .query(`
            SELECT * FROM events
            WHERE owner_id = ?
            AND eventStart_date >= CURRENT_TIMESTAMP
        `, [id])
        .then(([events]) => {
            if (events.length === 0) {
                next({ status: 404, error: `events not found` });
            }
            res.json(events)
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function getFinishedEvents(req, res, next) {
    const id = req.params.ID

    conn.promise()
        .query(`
            SELECT * FROM events
            WHERE owner_id = ?
            AND eventEnd_date <= CURRENT_TIMESTAMP
        `, [id])
        .then(([events]) => {
            if (events.length === 0) {
                next({ status: 404, error: `events not found` });
            }
            res.json(events)
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function getCurrentEvents(req, res, next) {
    const id = req.params.ID

    conn.promise()
        .query(`
            SELECT * FROM events
            WHERE owner_id = ?
            AND eventStart_date <= CURRENT_TIMESTAMP
            AND eventEnd_date >= CURRENT_TIMESTAMP
        `, [id])
        .then(([events]) => {
            if (events.length === 0) {
                next({ status: 404, error: `events not found` });
            }
            res.json(events)
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function getAssistance(req, res, next) {
    const id = req.params.ID

    conn.promise()
        .query(`
            SELECT e.*, a.comentary, a.puntuation
            FROM assistance AS a 
            INNER JOIN events AS e
            ON e.id = a.event_id
            WHERE a.user_id = ?
        `, [id])
        .then(([events]) => {
            if (events.length === 0) {
                next({ status: 404, error: `events not found` });
            }
            res.json(events)
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function getFutureAssistance(req, res, next) {
    const id = req.params.ID

    conn.promise()
        .query(`
            SELECT e.*, a.comentary, a.puntuation
            FROM assistance AS a 
            INNER JOIN events AS e
            ON e.id = a.event_id
            WHERE a.user_id = ?
            AND e.eventStart_date >= CURRENT_TIMESTAMP
        `, [id])
        .then(([events]) => {
            if (events.length === 0) {
                next({ status: 404, error: `events not found` });
            }
            res.json(events)
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function getFinishedAssistance(req, res, next) {
    const id = req.params.ID

    conn.promise()
        .query(`
            SELECT e.*, a.comentary, a.puntuation
            FROM assistance AS a 
            INNER JOIN events AS e
            ON e.id = a.event_id
            WHERE a.user_id = ?
            AND e.eventEnd_date <= CURRENT_TIMESTAMP
        `, [id])
        .then(([events]) => {
            if (events.length === 0) {
                next({ status: 404, error: `events not found` });
            }
            res.json(events)
        })
        .catch(err => {
            next({
                status: 500,
                error: `Server error`,
                track: err
            });
        })
}

async function getFriends(req, res, next) {

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
