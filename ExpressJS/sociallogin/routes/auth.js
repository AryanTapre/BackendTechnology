const router = require('express').Router();
const passport = require('passport');
const {request, response} = require("express");

let sessionStore = undefined;

const isLoggedIn = (request,response,next) => {
  //  session = request.session;
    console.log("is logged in middleware = ",sessionStore);
    if(sessionStore) {
        next();
    } else {
        console.log("back home");
        response.redirect("/")
    }
}

router.route("/home").get( isLoggedIn,(request,response) => {

    response.render("home");
})

router.route("/google").get(
    passport.authenticate('google',{
        scope:["profile","email"],
    })
    , (request,response) => {
       response.send("login with Google")
    }
)

router.route("/logout").get(isLoggedIn,(request,response) => {
    console.log("destroy: ",request.session);
    request.session.destroy((session) => {
        console.log(" in destroy: ",request.session);
    })
    response.redirect("/")
})

router.route("/google/callback").get(passport.authenticate('google'),(request,response) => {
    // session = request.session;
    console.log("session is:",request.session.passport);
    sessionStore = request.session;
    sessionStore.username = request.session.passport.user.name;

    console.log("sessionStore = ",sessionStore);

    response.redirect("/auth/home")
})

module.exports = router;


