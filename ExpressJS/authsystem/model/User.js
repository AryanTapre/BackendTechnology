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
        type: String
    }

});

// userSchema.virtual('fullName').get(() => {
//     return this.firstname + ' '+ this.lastname;
// });

// userSchema.virtual('fullName').set((val) => {
//     let str = val.split(' ');
//     this.firstname = str[0];
//     this.lastname = str[1];
// })

module.exports = mongoose.model('user',userSchema);



