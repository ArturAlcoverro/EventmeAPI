const router = require("express").Router();
const controller = require("../controller/events.controller")

router.post("/", controller.create)
router.get("/", controller.get)
router.get("/:ID", controller.getByID)
router.put("/:ID", controller.update)
router.delete("/:ID", controller.del)
router.get("/:ID/assistances", controller.getAssistances)
router.get("/:ID/assistances/:ID_USER", controller.getAssistancesByUser)
router.post("/:ID/assistances", controller.createAssistance)
router.put("/:ID/assistances", controller.updateAssistance)
router.delete("/:ID/assistances", controller.deleteAssistance)

module.exports = router;