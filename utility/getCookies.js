import axios from "axios"
import qs from "qs"
import dotenv from "dotenv"
import { CookieJar } from "tough-cookie"
import { wrapper } from "axios-cookiejar-support"
import { getElement } from "../utility/getElement.js"

axios.defaults.withCredentials = true
dotenv.config()

export const getCookies = async (username, password) => {
  const cookieJar = new CookieJar()
  const axiosRequest = wrapper(axios.create({ jar: cookieJar }))
  try {
    const { elements } = await getElement(process.env.LOGIN_URL, null)
    elements["__EVENTTARGET"] = ""
    elements["txtUserName"] = username
    elements["txtPassword"] = password
    elements["btnSubmit"] = "Đăng nhập"

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36",
      },
      jar: cookieJar,
    }

    let elementsQS = qs.stringify(elements)
    await axiosRequest.post(process.env.LOGIN_URL, elementsQS, config)

    return {
      task: "getCookies",
      success: true,
      cookies: cookieJar,
    }
  } catch (error) {
    return error
  }
}
