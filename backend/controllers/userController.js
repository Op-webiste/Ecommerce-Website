const CatchAsyncError = require("../middleware/CatchAsyncError")
const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler")
const sendToken = require("../utils/jwtToken")
const crypto = require("crypto")
const nodemailer= require("nodemailer")

// Get All Users--Admin
exports.getAllUsersbyAdmin =CatchAsyncError( async(req,res)=>{
const user = await User.find().select("-password")
res.status(200).json({Success:true,user})
})
// Delete Users--Admin
exports.deleteUsersbyAdmin =CatchAsyncError( async(req,res,next)=>{
    let user = await User.findById(req.params.id)
    if(!user){return next(new ErrorHandler("User Not Found",400))}

    user = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({Success:true,message:"User Successfully Deleted"})
})
// Update Users--Admin
exports.updateUsersbyAdmin =CatchAsyncError( async(req,res,next)=>{
    let user = await User.findById(req.params.id)
    if(!user){return next(new ErrorHandler("User Not Found",400))}

    user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    await user.save({validateBeforeSave:false})
    sendToken(user,200,res)
})




// SignUp Users--Authenctication
exports.signup =CatchAsyncError( async(req,res)=>{
    
    const user = await User.create(req.body)
    sendToken(user,200,res)
    
})
// Login Users--Authenctication
exports.login =CatchAsyncError( async(req,res,next)=>{
    const {email,password}= req.body
    const user = await User.findOne({email})
    if(!user){return next(new ErrorHandler("Invalid Credentials",400))}

    const comPass =await user.comparedPassword(password)
    if(!comPass){return next(new ErrorHandler("Invalid Credentials",400))}

    
    sendToken(user,200,res)
})
// Forget Password Users--Authenctication
exports.forgetPassword =CatchAsyncError( async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){return next(new ErrorHandler("No User Found With this Email Address",400))}

    // regenrate token
    const token  = crypto.randomBytes(20).toString("hex")

    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
    user.resetPasswordExpire = Date.now() + 15*60*1000

    await user.save({validateBeforeSave:false})

    const resetPassswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${token}`
    const message = `Your Reset Password token is : \n\n ${resetPassswordUrl} \n\n If you not requested this token then please ignore it.`



   try {
    
   const transporter = nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    auth:{
        user:process.env.MY_EMAIL,
        pass:process.env.MY_EMAIL_PASS
    }
   })

   const mailOptions = {
    from:process.env.MY_EMAIL,
    to:user.email,
    subject:process.env.EMAIL_SUBJECT,
    text:message
   }

   transporter.sendMail(mailOptions,(error)=>{
    if(error){
    return next(new ErrorHandler("Email Not Sent"))
    }
    res.status(200).json({Success:true,message:`Email Sent Successfully to ${user.email}`})
   })
   } catch (error) {
    user.resetPasswordToken = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ error: error })
   }

})
// Reset Password Users--Authenctication
exports.resetPassword =CatchAsyncError( async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
    if(req.body.newPassword !== req.body.confirmPassword){return next(new ErrorHandler("Password Does Not Matched",400))}

    user.password = req.body.newPassword
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave:true})

    sendToken(user,200,res,user.password)

})





// Logout Users--Users
exports.logoutbyUser =CatchAsyncError( async(req,res)=>{
   res.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
   res.status(200).json({
    Success:true,
    message:"Logged Out"
   })
})
// Update Users Data--Users
exports.updatebyUser =CatchAsyncError( async(req,res)=>{
   const data ={
    name:req.body.name,
    email:req.body.email
   }
   const user = await User.findByIdAndUpdate(req.user._id,data,{new:true,runValidators:true})
   await user.save({validateBeforeSave:false})
   sendToken(user,200,res)
})
// Update Password Users--Users
exports.updatePasswordbyUser =CatchAsyncError( async(req,res,next)=>{
    const user = await User.findById(req.user.id)
    const comPass =await user.comparedPassword(req.body.oldPassword)
    if(!comPass){return next(new ErrorHandler("Old Password Is Wrong",400))}

    if(req.body.newPassword !== req.body.confirmPassword){return next(new ErrorHandler("New Password and Confirm Password are not Matched",400))}
    user.password = req.body.newPassword
    
    await user.save({validateBeforeSave:false})
    sendToken(user,200,res)
})
// Delete Account By User--Users
exports.deleteAccountbyUser =CatchAsyncError( async(req,res,next)=>{
   const user = await User.findByIdAndDelete(req.user.id)
   
   res.status(200).json({
    Success:true,
    message:"Account Successfully Deleted"
   })
})
 






