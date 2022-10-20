import express from "express"
import { ScheduleRoute } from "./Schedule.router.js"

const router = express.Router()

router.use("/v1", ScheduleRoute)

export const apiv1 = router
