const router = require("express").Router();

const controller = require("../controller/messages.controller")

router.post("/", controller.create)
router.get("/users", controller.get)
router.get("/:USER_ID", controller.getByID)

module.exports = router;