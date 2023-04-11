const ErrorHandler = require("../utils/errorHandler")

module.exports = (err,res,req,next)=>{
     err.message = err.message;
     err.statusCode = err.statusCode;

   // Wrong Mongodb Id Error
   if(err.name === "CastError"){
      const message = `Resource Not Found Invalid : ${err.path}`
      err = new ErrorHandler(message,400)
   }

    // Duplicate Mongodb Key Error
    if(err.code === 11000){
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
      err = new ErrorHandler(message,400)
   }

    // JWT Error
    if(err.name === "JsonWebTokenError"){
      const message = `Json Web Token Error, Try again`
      err = new ErrorHandler(message,400)
   }
    // Token Expire Error
    if(err.name === "TokenExpiredError"){
      const message = `Token is Expired, Try again`
      err = new ErrorHandler(message,400)
   }

     res.status(err.statusCode).json({
        Success :false,
        message:err.message
     })
}