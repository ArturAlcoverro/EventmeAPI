const router = require("express").Router();
const controller = require("../controller/friends.controller")

router.get("/requests", controller.getRequests)
router.get("/", controller.get)
router.post("/:ID", controller.request)
router.put("/:ID", controller.accept)
router.delete("/:ID", controller.del)

module.exports = router;