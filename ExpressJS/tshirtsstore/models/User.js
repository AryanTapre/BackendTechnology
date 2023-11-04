const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'name is mandatory'],
        maxLength: [40,'name should be under 40 characters']
    },
    email: {
        type: String,
        required: [true,'email is mandatory'],
        validate: [validator.isEmail,'email should be in right format'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'password is mandatory'],
        select: false,
        minLength: [6,'password should be atleast 6 characters']
    },
    photo: {
        id: {
            type: String,
           
        },
        secure_url: {
            type: String,
            
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    forgetPasswordToken:String,
    forgetPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }

})

//FIXME: pre-hooks 
//Encrypting the password before Save
userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

//TODO: Appending methods to document

//validate the password - compare that is stored in DB
userSchema.methods.isValidatePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword,this.password);
}

//generating jwt token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_SECRET_EXPIRY
    })
}


//forget password string generation
userSchema.methods.getForgetPasswordToken = function() {
    const forgetToken = crypto.randomBytes(20).toString("hex");

    this.forgetPasswordToken = crypto
    .createHash("sha256")
    .update(forgetToken)
    .digest("hex");

    this.forgetPasswordExpiry = Date.now() + 20 * 60 * 1000;

    return forgetToken;
}



//Exporting model
module.exports = mongoose.model("User",userSchema);