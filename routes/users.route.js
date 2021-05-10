const express = require("express");
const router = require("express").Router();

const controller = require("../controller/users.controller");
const validator = require("../validation/users.validation");

const authController = require("../controller/auth.controller");
const authValidator = require("../validation/auth.validation")

const authMiddleware = require("../authentication");

//PUBLIC
router.post("/login", authValidator.login, authController.login);
router.post("/", authValidator.register, authController.register);

router.use(authMiddleware);

//PRIVATE
router.get("/", controller.get);
router.get("/search", validator.search, controller.search);
router.put("/", authValidator.register, controller.update);
router.delete("/", controller.del);

router.get("/:ID", validator.id, controller.getById);
router.get("/:ID/events", validator.id, controller.getEvents);
router.get("/:ID/events/future", validator.id, controller.getFutureEvents);
router.get("/:ID/events/finished", validator.id, controller.getFinishedEvents);
router.get("/:ID/events/current", validator.id, controller.getCurrentEvents);

router.get("/:ID/assistance", validator.id, controller.getAssistance);
router.get("/:ID/assistance/future", validator.id, controller.getFutureAssistance);
router.get("/:ID/assistance/finished", validator.id, controller.getFinishedAssistance);

router.get("/:ID/friends", validator.id, controller.getFriends);

module.exports = router;
