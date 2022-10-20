import { Readable } from "stream"
import * as fs from "node:fs"
import * as XLSX from "xlsx/xlsx.mjs"
import * as cpexcel from "xlsx/dist/cpexcel.full.mjs"

XLSX.stream.set_readable(Readable)
XLSX.set_fs(fs)
XLSX.set_cptable(cpexcel)

export const readFile = async (data) => {
  try {
    let schedule = []

    const getAddressCell = (str) => {
      const regex = /\d+/
      const row = +str.match(regex)[0]
      const column = str.replace(row, "")
      return { row, column }
    }

    const formatDMY = (date) => {
      const str_date = date.split("/")
      const day = str_date[0]
      const month = str_date[1]
      const year = str_date[2]
      return new Date(`${year}/${month}/${day}`)
    }

    const findDateListWithDay = (start_date, end_date, day) => {
      let date_list = []

      for (let i = start_date; i < end_date; i += 24 * 60 * 60 * 1000) {
        let date_check = new Date(i)

        if (date_check.getDay() == day - 1) {
          date_list.push(date_check.getTime())
        }
      }
      return date_list
    }

    const findDateIndex = (date) => {
      for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].date == date) {
          return i
        }
      }
      return -1
    }

    const addToSchedule = (
      start_date,
      end_date,
      name,
      day,
      class_address,
      lesson_array
    ) => {
      const date_list = findDateListWithDay(start_date, end_date, day)
      for (let i = 0; i < date_list.length; i++) {
        var found = findDateIndex(date_list[i])
        if (found == -1) {
          let lessons = []
          lessons.push({
            subject_name: name,
            lesson: lesson_array,
            address: class_address,
          })
          schedule.push({ date: date_list[i], lessons })
        } else {
          schedule[found].lessons.push({
            subject_name: name,
            lesson: lesson_array,
            address: class_address,
          })
        }
      }
    }

    // get class, lesson, day about subject
    const getSubjectDetail = (day_start, day_end, name, str) => {
      str = str.split("\n")
      for (let i = 0; i < str.length; i++) {
        if (str[i] === "" || str[i] === undefined || str[i] === null) continue
        const str_info = str[i].split("tại")
        const class_address = str_info[1].replace(" ", "")
        const day_and_lesson = str_info[0].split("tiết")
        const lesson = day_and_lesson[1].replace(" ", "").replace(" ", "")
        const day = day_and_lesson[0].replace(" ", "").replace("Thứ", "")
        addToSchedule(day_start, day_end, name, day, class_address, lesson)
      }
    }

    var workbook = XLSX.read(data, { type: "buffer" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Get info student
    const student_name = worksheet["C6"]["v"]
    const student_id = worksheet["F6"]["v"]
    const class_name = worksheet["C7"]["v"]
    const major = worksheet["F8"]["v"]

    for (const cell in worksheet) {
      if (cell[0] === "!") continue

      if (
        worksheet[cell]["v"].toString().includes("Từ") &&
        worksheet[cell]["v"].toString().includes("đến")
      ) {
        const address_cell = getAddressCell(cell)
        const subject_name =
          worksheet[`F${address_cell.row}`]["v"].split("-")[0]
        const session_list = worksheet[cell]["v"].toString().split("Từ")

        for (let i = 0; i < session_list.length; i++) {
          if (session_list[i] == "") continue

          const str = session_list[i].replace("\n", "").split(":")
          const datetime_string = str[0].replace(" ", "").split("đến")
          const day_start = datetime_string[0]
          const day_end = datetime_string[1]

          getSubjectDetail(
            formatDMY(day_start).getTime(),
            formatDMY(day_end).getTime(),
            subject_name,
            str[1]
          )
        }
      }
    }

    return {
      task: "readFile",
      success: true,
      student_name,
      student_id,
      class: class_name,
      major,
      schedule,
    }
  } catch (error) {
    return error
  }
}
