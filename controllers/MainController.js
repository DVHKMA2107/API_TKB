import { getFileExcel } from "../utility/getFile.js"
import { readFile } from "../utility/readFile.js"
import md5 from "md5"

const ScheduleController = async (req, res) => {
  try {
    const { username, password } = req.body
    const encodedPassword = md5(password)

    const result = await getFileExcel(username, encodedPassword)
    const schedule = await readFile(result.data)

    res.status(200).json({
      success: true,
      schedule,
    })
  } catch (error) {
    return error
  }
}

export default ScheduleController
