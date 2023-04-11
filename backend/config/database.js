const mongoose = require("mongoose")

const databaseConnected = ()=>{
    mongoose.connect(process.env.DATABASE_API,{useNewUrlParser :true,useUnifiedTopology : true}).then(()=>{
        console.log(`Database Connected Successfully`)
    })
}

module.exports = databaseConnected