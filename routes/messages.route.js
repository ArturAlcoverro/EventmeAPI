/** Messages routes
 * @module route/messages
 */

const router = require("express").Router();

const controller = (require)("../controller/messages.controller")
const validator = require("../validation/messages.validation");


const authMiddleware = require("../authentication");

router.use(authMiddleware);

router.post("/", validator.create, controller.create)
router.get("/users", controller.getUsers)
router.get("/:USER_ID", validator.userID, controller.getByUser)

module.exports = router;