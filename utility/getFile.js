import axios from "axios"
import qs from "qs"
import dotenv from "dotenv"
import { wrapper } from "axios-cookiejar-support"
import { getElement } from "./getElement.js"
import { getCookies } from "./getCookies.js"

dotenv.config()

export const getFileExcel = async (username, password) => {
  try {
    const { cookies } = await getCookies(username, password)
    const { elements } = await getElement(process.env.SCHEDULE_URL, cookies)
    const axiosSchedule = wrapper(axios.create({ jar: cookies }))
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.18 Safari/537.36 Edg/75.0.139.4",
      },
      responseType: "arraybuffer",
    }
    let scheduleElementsQS = qs.stringify(elements)
    const { data } = await axiosSchedule.post(
      process.env.SCHEDULE_URL,
      scheduleElementsQS,
      config
    )

    return {
      task: "getFile",
      success: true,
      data,
    }
  } catch (error) {
    return error
  }
}
