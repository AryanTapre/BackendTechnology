const mongoose = require('mongoose');

// const {Schema} = mongoose  // destructing the data
 

const userSchema = new mongoose.Schema({
    
    firstname: {
        type: String,
        default: null,
        required: [true,'need firstname']
    },
    lastname: {
        type: String,
        default: null,
        required: [true,'need lastname']
    },
    email: {
        type: String,
        required: [true,'need email']
    },
    password: {
        type: String,
        required: [true,'need your password']
    },
    country: {
        type: String,
        required: [true,'need country']
    },
    token: {
        type: String,
    }

});

module.exports = mongoose.model('user',userSchema);