const router = require("express").Router();

const controller = require("../controller/users.controller");
const auth = require("../controller/auth.controller");

router.get("/login", auth.login);
router.get("/search", controller.search);

router.get("/", controller.get);
router.post("/", auth.register);
router.put("/", controller.update);
router.delete("/", controller.del);

router.get("/:ID", controller.getById);
router.get("/:ID/events", controller.getEvents);
router.get("/:ID/events/future", controller.getFutureEvents);
router.get("/:ID/events/finished", controller.getFinishedEvents);
router.get("/:ID/events/current", controller.getCurrentEvents);

router.get("/:ID/assistance", controller.getAssistance);
router.get("/:ID/assistance/future", controller.getFutureAssistance);
router.get("/:ID/assistance/finished", controller.getFinishedAssistance);

router.get("/:ID/friends", controller.getFriends);

module.exports = router;
