const router = require("express").Router();
const controller = require("../controller/friends.controller")
const validator = require("../validation/friends.validation");


const authMiddleware = require("../authentication");

router.use(authMiddleware);

router.get("/requests", controller.getRequests)
router.get("/", controller.get)
router.post("/:ID", controller.request)
router.put("/:ID", controller.accept)
router.delete("/:ID", controller.del)

module.exports = router;