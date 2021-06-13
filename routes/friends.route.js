/** Friends routes
 * @module route/friends
 */

const router = require("express").Router();
const controller = require("../controller/friends.controller")
const validator = require("../validation/friends.validation");

const authMiddleware = require("../authentication");

router.use(authMiddleware);

router.get("/requests", controller.getRequests)
router.get("/", controller.get)
router.post("/:ID", validator.id, controller.request)
router.put("/:ID", validator.id, controller.accept)
router.delete("/:ID", validator.id, controller.del)

module.exports = router;