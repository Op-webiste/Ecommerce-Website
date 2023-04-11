const express= require("express")
const app = express()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const user = require("./routes/userRoute")
const product = require("./routes/productRoute")
const order = require("./routes/orderRoute")
const middlewareError = require("./middleware/error")

// Data Giving in these format
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())

// For solve Errors
app.use(middlewareError)


// APIs
app.use("/api/v1",user)
app.use("/api/v1",product)
app.use("/api/v1",order)

module.exports = app
