const express = require('express');
const app = express();

require('dotenv').config();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const yaml = require('yamljs');
const fileSystem = require('fs');

//morgan middleware
app.use(morgan('tiny'));

//swagger
const file = fileSystem.readFileSync('./swagger.yaml','utf-8');
const swaggerDocument = yaml.parse(file);

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//custom middlewares
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(cookieParser());
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));

//EJS- Embedded JavaScript
app.set("view engine",'ejs');


//FIXME: importing routes
const home = require("../routes/home");
const {
        logoutRouter,
        signupRouter,
        loginRouter,
        forgetPasswordRouter,
        passwordResetRouter,
        dashboardRouter

      } = require('../routes/user');


// const login = require("../routes/login");
// const signup = require("../routes/signup");
// const logout = require("../routes/logout");


// FIXME: middlewares for routes
// app.use('/api/v1/',home);
// app.use('/api/v1/',signup);
// app.use('/api/v1/',login);
// app.use('/api/v1/',logout);
app.use('/api/v1',home);
app.use('/api/v1/',loginRouter);
app.use('/api/v1/',signupRouter);
app.use('/api/v1/',logoutRouter);
app.use('/api/v1/',forgetPasswordRouter);
app.use('/api/v1/',passwordResetRouter);
app.use('/api/v1/',dashboardRouter);

app.get("/signup",(request,response) => {
    response.render("signup")
})

app.get("/login",(request,response) => {
    response.render("login");
})

//TODO: Exporting app
module.exports = app;
