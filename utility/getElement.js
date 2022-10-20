import axios from "axios"
import * as cheerio from "cheerio"
import { wrapper } from "axios-cookiejar-support"

axios.defaults.withCredentials = true

export const getElement = async (url, cookies) => {
  const axiosElement = wrapper(axios.create({ jar: cookies }))
  try {
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.18 Safari/537.36 Edg/75.0.139.4",
      },
    }

    const { data } = await axiosElement.get(url, config)
    const $ = cheerio.load(data)
    let hiddenInputList = $('input[type="hidden"]')

    let elements = {}
    if (cookies !== null) {
      let optionsElementList = $('option[selected="selected"]')
      elements["PageHeader1$drpNgonNgu"] = optionsElementList[0].attribs.value
      elements["drpSemester"] = optionsElementList[1].attribs.value
      elements["drpTerm"] = optionsElementList[2].attribs.value
      elements["drpType"] = optionsElementList[3].attribs.value
      elements["btnView"] = "Xuất file Excel"
    }

    hiddenInputList.each(function () {
      if ($(this).attr("value") === undefined) {
        elements[$(this).attr("name")] = ""
      } else {
        elements[$(this).attr("name")] = $(this).attr("value")
      }
    })
    return { task: "getElement", success: true, elements }
  } catch (error) {
    return error
  }
}
