const express = require("express")
const {isAuthenticateUser,authenticateAdmin} = require("../middleware/auth")
const { getAllUsersbyAdmin, signup, deleteUsersbyAdmin, logoutbyUser, updateUsersbyAdmin, updatebyUser, login, updatePasswordbyUser, deleteAccountbyUser, forgetPassword, resetPassword } = require("../controllers/userController")
const router = express.Router()

// TO DO: I have to Add Admin Authentication at getAllusers after the completion of Project
// Only Admin Allowed--Login Required
router.route("/Admin/users").get(getAllUsersbyAdmin)
router.route("/Admin/users/delete/:id").delete(isAuthenticateUser,authenticateAdmin("admin"),deleteUsersbyAdmin)
router.route("/Admin/users/update/:id").put(isAuthenticateUser,authenticateAdmin("admin"),updateUsersbyAdmin)


// Authentication--No Login Required
router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/password/forget").post(forgetPassword)
router.route("/password/reset/:token").put(resetPassword)


// User--Login Required
router.route("/me/logout").get(isAuthenticateUser,logoutbyUser)
router.route("/me/update").put(isAuthenticateUser,updatebyUser)
router.route("/me/update/password").put(isAuthenticateUser,updatePasswordbyUser)
router.route("/me/delete").delete(isAuthenticateUser,deleteAccountbyUser)

module.exports = router