const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter the Name"],
        minLength:[2,"Name should exceed 2 charactors"],
        maxLength:[30,"Name cannnot exceed 30 charactors"]
    },
    email:{
        type:String,
        required:[true,"Please Enter the description"],
        validate:[validator.isEmail,"Please Enter Correct Email"],
        unique:[true,"User already exists with this email address"]
        
    },
    password:{
        type:String,
        required:[true,"Please Enter the password"],
        minLength:[8,"password should exceed 8 charactors"],
        maxLength:[30,"password cannnot exceed 30 charactors"]
    },
    avatar:[{
        public_id:{
            type:String,
            default:"Sample Public Id"
        },
        url:{
            type:String,
            default:"Sample image Url"
        }
    }],
    role:{
       type:String,
       default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

// Securing Password
userSchema.pre("save",async function(){
    const saltRounds = 10;
   this.password= await bcrypt.hash(this.password,saltRounds)
})

// Giving Json Web Token
userSchema.methods.getJWTToken = function(){
    return JWT.sign({id:this._id},process.env.JWT_SECRET)
}

// Compare Password
userSchema.methods.comparedPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}


module.exports = mongoose.model("User",userSchema)