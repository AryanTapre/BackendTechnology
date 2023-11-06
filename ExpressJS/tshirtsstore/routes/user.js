
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


const {
        logout,
        login,
        signup,
        forgetPassword,
        passwordReset,
        userDashboard,
        changePassword,
        updateUser,
        adminAllUsers
} = require('../controllers/userController');

loginRouter.route("/login").post(login);
signupRouter.route("/signup").post(signup);
logoutRouter.route("/logout").get(logout);
forgetPasswordRouter.route("/forgetpassword").post(forgetPassword);
passwordResetRouter.route("/password/reset/:token").post(passwordReset);

dashboardRouter.route("/dashboard").get(userMiddleware,userDashboard);
changePasswordRouter.route("/password/update").post(userMiddleware,changePassword);
userUpdateRouter.route("/dashboard/update").post(userMiddleware,updateUser);


adminAllUserRouter.route("/admin/users").get(userMiddleware,customRole('admin'),adminAllUsers);

module.exports = {
    loginRouter,
    signupRouter,
    logoutRouter,
    forgetPasswordRouter,
    passwordResetRouter,
    dashboardRouter,
    changePasswordRouter,
    userUpdateRouter,
    adminAllUserRouter
}


