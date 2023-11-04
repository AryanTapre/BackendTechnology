/*  TODO: while registering a user
    -   get all user information
    -   process that information (validation/get mandatory field)
    -   user already registered
    -   take care of password
    -   generate a token or send success registered message

*/

/* TODO: while login user
    -   get all user information
    -   process that information(validate/get mandatory fields)
    -   check user is already registered or not
    -   compare password that user sended with that stored in DB
    -   generate a token or send success login message
 */


/* FIXME: Protecting a route
Protecting routes:
use middlewares
check for token presence
verify that token
extract info from payload
NEXT()

web vs mobile - handling token
-just send token ,in case of web
-send cookie, httpOnly
-headers
-body,rare case
- when request is made some where in middle on a file add that token (axios can do this stuff) before it reaches to the server

*/


require('dotenv').config();

// db connection....
const dbConnect = require('../config/database.js');
dbConnect();

const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const User = require('../model/User.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const express = require('express');
const { reset } = require('nodemon');

const auth = require('../middleware/auth.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));


app.get("/",(req,res) => {
   
    res.status(200).send("<h1> connected to auth System</h1>");
})

app.post("/register",async (request,response) => {
    
    try {
        
                    // getting information
            const { firstname, lastname, email, password, country } = request.body;

            // processing information (validation)
            if(!(firstname && lastname && email && password && country)) {
                response.status(400).send("<h1>All fields are required!</h1>");
            }

            // user already registered..
            const existingUser = await User.findOne({email}); // return PROMISE

            if(existingUser) {
                return response.status(401).send("User already exists");
            }

            //take care of password
            // library used : bcrypt to encrypt the password....

            const encryptedPassword = await bcrypt.hash(password,10);

    
             //generate a token or send success message
             
             const user = await User.create({
                firstname:firstname,
                lastname:lastname,
                email:email,
                password: encryptedPassword,
                country:country, 
             })

            const userToken = jwt.sign(
                {user_id: user._id},   // header
                process.env.SECRET_KEY, //
                {
                    expiresIn: "2h"
                }
            )
            
            user.token = userToken;
            

            // send token or send success yes and redirect - your choice
            response.status(201).json(user);              

    } 
    catch (error) {
        console.log(error);
    }

})


app.post("/login",async (request,response) => {
    try {

        const { email,password } = request.body;

        if( !(email && password) ) {
            response.status(400).send("All fields are Mandatory");
        }

        const user = await User.findOne({ email }); // db call
     

        // if(!user) {
        //     return response.status(401).send("You are not registered");
        // }

        if(user && (await bcrypt.compare(password,user.password))) { // login successful
            const token = jwt.sign(
                {
                    user_id : user._id,
                    email : user.email
                },
                process.env.SECRET_KEY,
                {
                    expiresIn : "2h"
                }
            )

            user.token = token;
            user.password = undefined; // this field will not returned back to the client....

            // if you want to user cookie
            //TODO: COOKIE: sending token in cookie

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),// for 3 days
                //httpOnly: true // only accessible by backend
            }
            response.status(200).cookie("token",token,options).json({
                cookieSet: true,
                token,
                user
            })
          
        }

        //response.status(200).send(user);

    } catch (error) {
        console.log(error);
    }
});

app.get("/clearCookie",(req,res) => {
    res.clearCookie('token')
    res.send('Cookie deleted');
})

app.get("/dashboard",auth, (request,response) => {
    response.status(200).send("Welcome To AuthSystem Dashboard")
})

module.exports = app;


