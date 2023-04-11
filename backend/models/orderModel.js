const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

    ShippingInfo:{
        address:{type:String,required:[true,"Please Enter Address"]},
        state:{type:String,required:[true,"Please Enter state"]},
        city:{type:String,required:[true,"Please Enter city"]},
        country:{type:String,required:[true,"Please Enter country"]},
        phoneNo:{type:Number,required:[true,"Please Enter phoneNo"]},
        pinCode:{type:Number,required:[true,"Please Enter pinCode"]}
    },
    orderItems:[{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true
        },
        name:{type:String,required:[true,"Please Enter Product Name"]},
        price:{type:Number,required:[true,"Please Enter Product Price"]},
        quantity:{type:Number,required:[true,"Please Enter Product Quantity"]},
        image:{type:String,default:"Sample image"},
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paidAt:{type:Date,required:true},
    paymentInfo:{
        id:{type:String,required:[true,"Please Enter Id"]},
        id:{type:String,default:"Succeed"}
    },
    // itemPrice:{type:Number,required:[true,"Please Enter Item Price"]},
    taxPrice:{type:Number,required:[true,"Please Enter tax Price"]},
    shippingPrice:{type:Number,required:[true,"Please Enter Shipping Price"]},
    totalPrice:{type:Number,required:[true,"Please Enter Total Price"]},

    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model("Order",orderSchema)