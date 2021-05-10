const router = require("express").Router();
const controller = require("../controller/events.controller")
const validator = require("../validation/events.validation");

const authMiddleware = require("../authentication");

//PUBLIC
router.get("/", controller.get)
router.get("/:ID", validator.id, controller.getByID)

router.use(authMiddleware);

//PRIVATE
router.post("/", validator.create, controller.create)
router.put("/:ID", validator.update, validator.id, controller.update)
router.delete("/:ID", validator.id, controller.del)
router.get("/:ID/assistances", validator.id, controller.getAssistances)
router.get("/:ID/assistances/:ID_USER", validator.id_user, controller.getAssistancesByUser)
router.post("/:ID/assistances", validator.id, validator.createAssistance, controller.createAssistance)
router.put("/:ID/assistances", validator.id, validator.updateAssistance, controller.updateAssistance)
router.delete("/:ID/assistances", validator.id, controller.deleteAssistance)

module.exports = router;