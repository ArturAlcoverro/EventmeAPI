const router = require("express").Router();

const controller = (require)("../controller/messages.controller")
const authMiddleware = require("../authentication");

router.use(authMiddleware);

router.post("/", controller.create)
router.get("/users", controller.getUsers)
router.get("/:USER_ID", controller.getByUser)

module.exports = router;