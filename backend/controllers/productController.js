const Product = require("../models/productModel")
const CatchAsyncError= require("../middleware/CatchAsyncError")
const ErrorHandler = require("../utils/errorHandler")
const ApiFeatures = require("../utils/apiFeatures")

// Get All Product Details---Admin Only
exports.getAllProducts = CatchAsyncError(async(req,res)=>{
   const resultPerPage = 2
   const apifeatures = new ApiFeatures(Product.find(),req.query).search().pagination(resultPerPage).filter();
   const product = await apifeatures.query.populate("user","name email");
   res.status(200).json({Success:true,product})
})
   
// Add/Create Product Details---Admin Only
exports.addProducts = CatchAsyncError(async(req,res)=>{
    const {title,description,price,category}= req.body
    const product = await Product.create({
        title,
        description,
        price,
        category,
        user:req.user._id
    })
    res.status(200).json({Success:true,product})
})

// Delete Products---Admin Only
exports.deleteProducts = CatchAsyncError(async(req,res,next)=>{
   let product = await Product.findById(req.params.id)
   if(!product){return next(new ErrorHandler("Product Not Found",400))}

   product = await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({Success:true,message:"Product Successfully Deleted"})
})

// Update Products---Admin Only
exports.updateProducts = CatchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){return next(new ErrorHandler("Product Not Found",400))}
 
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
     res.status(200).json({Success:true,product,message:"Product Successfully Updated"})
})


// Get Single Product---Admin Only
exports.getSingleProduct = CatchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){return next(new ErrorHandler("Product Not Found",400))}
 
   
    res.status(200).json({Success:true,product,message:"Product Successfully Updated"})
})


// Add Reviews---Users--Login Required
exports.addReviewsInProduct = CatchAsyncError(async(req,res,next)=>{
   const {rating,comment,productId} = req.body
   const review={
    user:req.body._id,
    name:req.body.name,
    rating:Number(rating),
    comment
   }

   const product = await Product.findById(productId)
   if(!product){return next(new ErrorHandler("Product Not Found",400))}
   const isReviewed = product.reviews.find((rev)=> rev.user && rev.user.toString() === req.user._id.toString() )

   if(isReviewed){
     if(rev.user.toString() === req.user._id.toString()){
        rev.rating =rating,
        rev.comment=comment
     }
   }else{
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
   }
   
   let avg=0;
   product.reviews.forEach(rev=>{
       avg+=rev.rating
   })
   product.ratings = avg/product.reviews.length;

   await product.save({validateBeforeSave:false})
   res.status(200).json({Success:true})
})

 




 

