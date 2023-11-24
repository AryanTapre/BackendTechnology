const passport = require('passport');
const User = require('../models/user.model');
const {request} = require("express");

let googleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user,done) => {
    console.log("serialize user in SESSION :");
    done(null,user)
})

passport.deserializeUser(async (user,done) => {
    console.log("de-serialize user in")
    await User.findById(user._id,(err,user) => {
        done(err,user);
    })
})


passport.use(new googleStrategy(
    {
        clientID : "397400476402-ij9p34v8lkgjqk70mmbkfs5r2r78kilr.apps.googleusercontent.com",
        clientSecret : "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",
        callbackURL : "http://localhost:5000/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, next) {
        console.log("PROFILE = ",profile);
        
        User.findOne({email: profile._json.email})
        .then((user) => {
            if(user) {
                console.log("user already exist",user);
                next(null,user);
            }
            else {
                User.create({
                    name: profile.displayName,
                    googleID: profile.id,
                    email: profile._json.email
                })
                .then(user => {
                    console.log("New User:",user);
                    next(null,user)
                })
                .catch(error => {
                    console.log(error);
                    next(error);
                })
            }
        })

      }
))
