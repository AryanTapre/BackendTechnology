const User = require('../models/User')
const bigPromise = require('./bigPromise')
const customError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');


module.exports = bigPromise(async (request,response,next) => {

    const token = request.header("Authorization").replace("Bearer ","") ||
                  request.cookies.token ||
                  request.body.token


    if(!token) {
        return next(new customError("you are not LoggedIn","you are not LoggedIn",500));
    } else {

        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(decode) {
            const user_id = decode.id;
            request.userData =  await User.findById(user_id); // Attaching user information

        } else {
            return next(new customError("token expired login again","token expired login again",500));
        }
    }

    next();
})