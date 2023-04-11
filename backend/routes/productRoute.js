const express= require("express")
const {isAuthenticateUser,authenticateAdmin} = require("../middleware/auth")
const { getAllProducts, addProducts, deleteProducts, updateProducts, getSingleProduct, addReviewsInProduct } = require("../controllers/productController")
const router = express.Router()

router.route("/Admin/products").get(isAuthenticateUser,authenticateAdmin("admin"),getAllProducts)
router.route("/Admin/products/new").post(isAuthenticateUser,authenticateAdmin("admin"),addProducts)
router.route("/Admin/products/:id").delete(isAuthenticateUser,authenticateAdmin("admin"),deleteProducts)
router.route("/Admin/products/:id").put(isAuthenticateUser,authenticateAdmin("admin"),updateProducts)
router.route("/Admin/products/:id").get(isAuthenticateUser,authenticateAdmin("admin"),getSingleProduct)
router.route("/products/reviews").put(isAuthenticateUser,addReviewsInProduct)

module.exports = router