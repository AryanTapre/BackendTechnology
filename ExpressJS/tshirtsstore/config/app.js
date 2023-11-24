//require('dotenv').config();

require('dotenv').config({
    path: './environmentVariables/.env'
})

const express = require('express');
const axios = require('axios');
const app = express();

const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const yaml = require('yamljs');
const fileSystem = require('fs');

const passport = require('passport');
const googlePassportConfig = require('../passport/googlePassport')
const facebookPassportConfig = require('../passport/facebookPassport');

const session = require('express-session');

app.use(session({
    secret: "helloThisSecret",
    cookie: {
        maxAge: 60000
    }
}))

// middleware for passport settings....
app.use(passport.initialize(googlePassportConfig));
app.use(passport.initialize(facebookPassportConfig))

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
const {homeRouter} = require("../routes/home");
const {
        logoutRouter,
        signupRouter,
        loginRouter,
        forgetPasswordRouter,
        passwordResetRouter,
        dashboardRouter,
        changePasswordRouter,
        userUpdateRouter,
        adminAllUserRouter,
        managerAllUserRouter,
        adminUserRouter,
        googleLoginRouter,
        facebookLoginRouter,
        googleCallbackHandlerRouter,
        facebookCallbackHandlerRouter
} = require('../routes/user');


const {productRouter} = require('../routes/product')
const {paymentRouter} = require('../routes/payment')
const {orderRouter} = require('../routes/order')



// FIXME: middlewares for routes
//user Routes
app.use(homeRouter);
app.use('/api/v1/',loginRouter);
app.use('/api/v1/',signupRouter);
app.use('/api/v1/',logoutRouter);
app.use('/api/v1/',forgetPasswordRouter);
app.use('/api/v1/',passwordResetRouter);
app.use('/api/v1/',dashboardRouter);
app.use('/api/v1/',changePasswordRouter);
app.use('/api/v1/',userUpdateRouter);
app.use('/api/v1/',adminAllUserRouter);
app.use('/api/v1/',managerAllUserRouter);
app.use('/api/v1',adminUserRouter)


//Product Routes
app.use('/api/v1/',productRouter);

//Payment Routes
app.use('/api/v1',paymentRouter);

//Order routers
app.use('/api/v1',orderRouter);

// google login router
app.use('/api/v1',googleLoginRouter)

// google callback handler
app.use('/api/v1',googleCallbackHandlerRouter)

//facebook login router
app.use('/api/v1',facebookLoginRouter);

//facebook callback hander
app.use('/api/v1',facebookCallbackHandlerRouter)


app.get("/signup",(request,response) => {
    response.render("signup")
})

app.get("/login",(request,response) => {
    response.render("login");
})

app.get("/checkout",async(request,response) => {
    const result = await axios.get("http://localhost:5000/api/v1/get/product/655763bb47d0f0a93dddafd1");
    console.log(result.data);
    response.render("checkout",{productData:result.data.productInformation});
})



//TODO: Exporting app
module.exports = app;
