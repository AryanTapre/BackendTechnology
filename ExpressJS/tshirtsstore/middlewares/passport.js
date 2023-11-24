const bigPromise = require('./bigPromise')
const passport = require('passport')

exports.googleAuthenticate = passport.authenticate('google',{
    scope: ["profile", "email"],
})

exports.facebookAuthenticate = passport.authenticate('facebook',{
    scope: ["profile", "email"],
})