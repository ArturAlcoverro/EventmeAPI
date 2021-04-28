const router = require("express").Router();

const controller = require("../controller/users.controller");
const validator = require("../validation/users.validation");

const authController = require("../controller/auth.controller");
const authValidator = require("../validation/auth.validation")

const authMiddleware = require("../authentication");

//PUBLIC
router.post("/login", authValidator.login, authController.login);
router.post("/", authController.register);

router.use(authMiddleware);

//PRIVATE
router.get("/", controller.get);
router.get("/search", validator.search, controller.search);
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
