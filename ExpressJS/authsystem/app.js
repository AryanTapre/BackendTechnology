/*  TODO: while registering a user
    -   get all user information
    -   process that information (validation/get mandatory field)
    -   user already registered
    -   take care of password
    -   generate a token or send success message

*/



require('dotenv').config();

// db connection....
const connectDB = require('./config/database');
connectDB.connect();


const User = require('./model/User');

const express = require('express');

const app = express();

app.get("/",(req,res) => {
    res.status(200).send("<h1> connected to auth System</h1>");
})

app.post("/register",async (request,response) => {
    // getting information
    const {firstname, lastname, email, password, country} = request.body();

    // processing information (validation)
    if(!(firstname && lastname && email && password && country)) {
        response.status(400).send("All fields are required!");
    }

    // user already registered..
    const existingUser = await User.findOne({email}); // return PROMISE


    if(existingUser) {
        response.status(401).send("User already exists");
    }




})

module.exports = app;