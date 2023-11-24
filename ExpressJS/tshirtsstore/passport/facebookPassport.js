const facebookPassport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;

facebookPassport.use(new facebookStrategy(
    {
        clientID : process.env.FACEBOOK_APP_ID,
        clientSecret : process.env.FACEBOOK_APP_SECRET,
        callbackURL : process.env.FACEBOOK_CALLBACK_URL
    },
    (accessToken,refreshToken,profile,next) => {
        console.log("facebook profile: ",profile);
        next();
    }
))