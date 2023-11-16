//importing middlewares
const {userMiddleware,customRole} = require('../middlewares/user');



const express = require('express');
const loginRouter = express.Router();
const signupRouter = express.Router();
const logoutRouter = express.Router();
const forgetPasswordRouter = express.Router();
const passwordResetRouter = express.Router();
const dashboardRouter = express.Router();
const changePasswordRouter = express.Router();
const userUpdateRouter = express.Router();
const adminAllUserRouter = express.Router();
const managerAllUserRouter = express.Router();
const adminUserRouter = express.Router();



const {
    logout,
    login,
    signup,
    forgetPassword,
    passwordReset,
    userDashboard,
    changePassword,
    updateUser,
    adminAllUsers,
    managerAllUsers,
    adminGetUser,
    adminUpdateUser,
    adminDeleteUser
} = require('../controllers/userController');

loginRouter.route("/login").post(login);
signupRouter.route("/signup").post(signup);
logoutRouter.route("/logout").get(logout);
forgetPasswordRouter.route("/forgetpassword").post(forgetPassword);
passwordResetRouter.route("/password/reset/:token").post(passwordReset);

dashboardRouter.route("/dashboard").get(userMiddleware,userDashboard);
changePasswordRouter.route("/password/update").post(userMiddleware,changePassword);
userUpdateRouter.route("/dashboard/update").post(userMiddleware,updateUser);

//admin only route
adminAllUserRouter.route("/admin/users").get(userMiddleware,customRole('admin'),adminAllUsers);

//Manager only Route
managerAllUserRouter.route("/manager/users").get(userMiddleware,customRole('manager'),managerAllUsers);


adminUserRouter.route("/admin/user/:id")
    .get(userMiddleware,customRole('admin'),adminGetUser)    // admin getting detail of Single User
    .put(userMiddleware,customRole('admin'),adminUpdateUser) // admin updating user detail
    .delete(userMiddleware,customRole('admin'),adminDeleteUser); // admin delete a user



module.exports = {
    loginRouter,
    signupRouter,
    logoutRouter,
    forgetPasswordRouter,
    passwordResetRouter,
    dashboardRouter,
    changePasswordRouter,
    userUpdateRouter,
    adminAllUserRouter,
    managerAllUserRouter,
    adminUserRouter
}