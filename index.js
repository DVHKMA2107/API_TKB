import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { apiv1 } from "./routes/v1/index.js"
import cookieParser from "cookie-parser"

const PORT = 8000
// SET UP
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(
  express.urlencoded({
    extended: false,
  })
)
dotenv.config()

// CONFIG HEADER
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  )
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type")
  res.setHeader("Access-Control-Allow-Credentials", true)
  next()
})

// app.get("/", (req, res) => {
//   res.send("Hello world")
// })

app.use("/", apiv1)

app.listen(PORT, () => {
  console.log("Server is running ...")
})
