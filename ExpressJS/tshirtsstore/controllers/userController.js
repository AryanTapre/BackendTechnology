const bigPromise = require('../middlewares/bigPromise');
const User = require('../models/User');
const CustomError = require('../utils/CustomError');
const cookieToken = require('../utils/UserCookieToken');
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/EmailHelper');
const crypto = require('crypto');
const {resolveContent} = require("nodemailer/lib/shared");


const signupOperations =  async (request,response,next) => {

    let cloudinaryResult;

    if(request.files) {
        const userPhoto = request.files.userphoto;
        const options = {
            folder: "Users",
            crop:"scale"
        }
      cloudinaryResult = await cloudinary.v2.uploader.upload(userPhoto.tempFilePath,options);
    }


    const {name, email, password} = request.body;

    if(!(name && email && password)) {
        return next(new CustomError("name,email & password are required!","not available these fields",400) )
    }
    else {

        const user = await User.create({
            name, 
            email, 
            password,
            photo: {
                id: cloudinaryResult.public_id,
                secure_url: cloudinaryResult.secure_url
            }
        });
      
        cookieToken(user,response);
    }
  
}

const loginOperations = async(request,response,next) => {

    const {email,password} = request.body;

    if(!(email && password)) {
        return next(new CustomError("email and password are missing","email and password are missing","401"));
    }

    const user = await User.findOne({email}).select("+password");

    if(!(user)) {
        return next(new CustomError("user does not exist","not registered","401"));
    }
    else {
        const result = await user.isValidatePassword(password);

        if(!result) {
            return next(new CustomError("Invalidate password","not correct password","401"));
        } 
        else {
            // Everything is correct up-till now!.
            cookieToken(user,response)
        }

    }
}

const logoutOperation = (request,response,next) => {
    response.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    response.status(200).json({
        "success": true,
        "msg": "logout successful"
    })
}

const forgetPasswordOperation = async (request,response,next) => {
    const {email} = request.body;
    const user = await User.findOne({email});
    console.log(`user data: ${user}`);

    if (!user) {
        return next(new CustomError("email does not exists","incorrect email",500));
    }

    const forgetToken = user.getForgetPasswordToken(); // generating forget token
    await user.save({validateBeforeSave: false}) // saving to the database....
    const forgetPasswordURL = `${request.protocol}://${request.get("host")}/api/v1/password/reset/${forgetToken}`;

    const message = `paste the above link to any browser address bar \n\n link:${forgetPasswordURL}`;

    try {
        await mailHelper({
            email: user.email,
            subject: "password reset email for T-shirt Store 😁",
            message
        })

        
    } catch (error) {
        user.forgetPasswordToken = undefined
        user.forgetPasswordExpiry= undefined;
        await user.save({validateBeforeSave: false});
        return next(new CustomError("failed to sent email","failed to sent email",500));
    }
    
    response.status(200).send("email sended successfully").json({
        success: true,
        mailStatus: "fulfilled"
    })
}

const passwordReset = async(request,response,next) => {
    const token = request.params.token;
    const {password,confirmPassword} = request.body;

    const forgetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")
    
    
    const user = await User.findOne({
        forgetPasswordToken,
        forgetPasswordExpiry: {$gt: Date.now()}
    })

    if(!user) {
        return next(new CustomError("invalid or expired token","invalid or expired token",500));
    } else {

        if(password != confirmPassword) {
            return next(new CustomError("password and confirm password does not Match!","password and confirm password does not Match!",500));

        }else {

            user.password = password;
            user.forgetPasswordToken = undefined;
            user.forgetPasswordExpiry = undefined;
            await user.save();

            response.status(201).send("password updated Successfully, You can login").json({
                success: true,
                message: "password updated Successfully, You can login now"
            })

        }
    }
}

const userDashboard = (request,response,next) => {
    const data = {
        username: request.userData.name,
        profile_pic: request.userData.photo.secure_url
    }

    response.status(200).json(data);
}

exports.passwordReset = bigPromise(passwordReset);
exports.forgetPassword = bigPromise(forgetPasswordOperation);
exports.signup = bigPromise(signupOperations);
exports.login = bigPromise(loginOperations);
exports.logout = bigPromise(logoutOperation);
exports.userDashboard = bigPromise(userDashboard);
