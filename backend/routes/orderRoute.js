const express= require("express")
const {isAuthenticateUser,authenticateAdmin} = require("../middleware/auth")
const { getAllOrdersbyAdmin, addOrder, deleteOrdersbyAdmin, updateOrderbyAdmin, deleteOrdersbyUser } = require("../controllers/orderController")
const router = express.Router()

// Only Admin Allowed
router.route("/orders").get(getAllOrdersbyAdmin)
router.route("/orders/:id").delete(isAuthenticateUser,authenticateAdmin("admin"),deleteOrdersbyAdmin)
router.route("/orders/:id").put(isAuthenticateUser,authenticateAdmin("admin"),updateOrderbyAdmin)



// Users -- Login Required
router.route("/orders/new").post(isAuthenticateUser,addOrder)
router.route("/orders/:id").delete(isAuthenticateUser,deleteOrdersbyUser)



module.exports= router