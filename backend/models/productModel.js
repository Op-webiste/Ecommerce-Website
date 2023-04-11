const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true,"Please Enter the Title"],
        minLength:[5,"Title Should Exceed 5 Charactors"],
        maxLength:[50,"Title Cannot Exceed 50 Charactors"]
    },
    description:{
        type:String,
        required:[true,"Please Enter the description"],
        minLength:[5,"description Should Exceed 5 Charactors"],
        maxLength:[500,"description Cannot Exceed 50 Charactors"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Price"]
    },
    images:{
            public_id:{
                type:String,
                default:"Sample Id"
            },
            url:{
                type:String,
                default:"Sample Url"
            }
    },
    category:{
        type:String,
        required:[true,"Please Enter Category"]
    },
    ratings:{
        type:Number,
        default:0
    },
    numOfReviews:{
      type:Number,
      default:0
    },
    user:{
      type:mongoose.Schema.ObjectId,
      ref:"User",
      required:true
    },
    reviews:[
        {user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
          },
          name:{
            type:String
          },
          rating:{
            type:Number,
            default:0
          },
          comment:{
            type:String
          }
         
        }
    ],
    stock:{
        type:Number,
        required:true,
        default:1
    }

    
})

module.exports = mongoose.model("Product",productSchema)