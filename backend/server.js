const app = require("./app")
const dotenv = require("dotenv")
const databaseConnected = require("./config/database")
dotenv.config({path:"backend/config/config.env"})


// Connecting Database
databaseConnected()

app.listen(process.env.PORT,()=>{
    console.log(`App Running Fine on PORT: ${process.env.PORT}`)
})