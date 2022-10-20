import express from "express"
import MainController from "../../controllers/MainController.js"

const router = express.Router()

router.post("/", MainController)

export const ScheduleRoute = router
