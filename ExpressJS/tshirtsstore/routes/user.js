
//importing middlewares
const userMiddleware = require('../middlewares/user');


const express = require('express');
const loginRouter = express.Router();
const signupRouter = express.Router();
const logoutRouter = express.Router();
const forgetPasswordRouter = express.Router();
const passwordResetRouter = express.Router();
const dashboardRouter = express.Router();


const {logout,login,signup,forgetPassword,passwordReset,userDashboard} = require('../controllers/userController');

loginRouter.route("/login").post(login);
signupRouter.route("/signup").post(signup);
logoutRouter.route("/logout").get(logout);
forgetPasswordRouter.route("/forgetpassword").post(forgetPassword);
passwordResetRouter.route("/password/reset/:token").post(passwordReset);
dashboardRouter.route("/dashboard").get(userMiddleware,userDashboard);

module.exports = {
    loginRouter,
    signupRouter,
    logoutRouter,
    forgetPasswordRouter,
    passwordResetRouter,
    dashboardRouter
}


