const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const CatchAsyncError = require("../middleware/CatchAsyncError")
const ErrorHandler = require("../utils/errorHandler")

// Get All Orders---Admin Only
exports.getAllOrdersbyAdmin =CatchAsyncError( async(req,res)=>{
const order =await Order.find().populate("user", "name email")
let totalAmount = 0;
order.forEach(order=>{
  totalAmount+=order.totalPrice;
})
res.status(200).json({Success:true,order,totalAmount})
})
// Delete Orders---Admin Only
exports.deleteOrdersbyAdmin =CatchAsyncError( async(req,res,next)=>{
    let order =await Order.findById(req.params.id)
    if(!order){return next(new ErrorHandler("Order Not Found",400))}

    order = await Order.findByIdAndDelete(req.params.id)
    res.status(200).json({Success:true,message:"Order Successfully Deleted"})
})
// Update Orders---Admin Only
exports.updateOrderbyAdmin = CatchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){return next(new ErrorHandler("Order Not Found",400))}

    if(order.orderStatus==="Delivered"){return next(new ErrorHandler("You already Delivered this Product",400))}

    order.orderItems.forEach(async (order)=>{
        await updateStock(order.product,order.quantity)
    })

    order.orderStatus = req.body.status
    if(req.body.status ==="Delivered"){order.deliveredAt = Date.now()}
    await order.save({validateBeforeSave:false})
    res.status(200).json({Success:true})

    
})

async function updateStock(id,quantity){
    const product = await Product.findById(id)
    if(!product){return next(new ErrorHandler("Product Not Found",400))}
    product.stock-=quantity
  await product.save({validateBeforeSave:true})
}

// Add Orders---Users--Login Required
exports.addOrder =CatchAsyncError( async(req,res)=>{
    const {ShippingInfo,orderItems,paymentInfo,taxPrice,shippingPrice,totalPrice,orderStatus}=req.body

    const order = await Order.create({
        ShippingInfo,
        orderItems,
        paymentInfo,
        shippingPrice,
        // itemPrice,
        taxPrice,
        totalPrice,
        orderStatus,
        user:req.user._id,
        paidAt:Date.now()
    })
    res.status(200).json({Success:true,message:"Order Successfully Placed",order})
    
})
// Delete Orders---Users--Login Required
exports.deleteOrdersbyUser = CatchAsyncError(async (req, res, next) => {
    const order  = await Order.findById(req.params.id)
    if(!order){return next(new ErrorHandler("No Order Found",400))}

    if(order.user !== req.user._id){return next(new ErrorHandler("You Cannot Delete This Order",400))}

     order = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Order Successfully Deleted' });
})



