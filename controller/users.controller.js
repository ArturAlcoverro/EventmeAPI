const conn = require("../database/connection");

// async function all(req, res, next) {
//   console.log("all users");
//   const [users] = await conn
//     .promise()
//     .query(`SELECT id, login, name FROM users`);
//   if (users.length === 0)
//     return next({ status: 404, error: `users not found` });

//   const [videogames] = await conn
//     .promise()
//     .query(
//       `select * from scores left join videogames on scores.videogame = videogames.id`
//     );

//   const result = users.map((e) => {
//     e.videogames = videogames
//       .filter((a) => a.user === e.id)
//       .map(({ user, videogame, ...agua }) => agua);
//     //.map(({ id, name, score }) => ({ id, name, score }));
//     return e;
//   });

//   return res.json(result);
// }


async function search(req, res, next){

}

async function get(req, res, next){
    
}

async function update(req, res, next){

}

async function del(req, res, next){

}

async function getById(req, res, next){

}

async function getEvents(req, res, next){

}

async function getFutureEvents(req, res, next){

}

async function getFinishedEvents(req, res, next){

}

async function getCurrentEvents(req, res, next){

}

async function getAssistance(req, res, next){

}

async function getFutureAssistance(req, res, next){

}

async function getFinishedAssistance(req, res, next){

}

async function getFriends(req, res, next){

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
