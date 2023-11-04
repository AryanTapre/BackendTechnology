const mongoose = require('mongoose');
const {MONGODB_URL} = process.env;

// exports.connect = () => {

//     mongoose.connect(MONGODB_URL,{
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log(`DB CONNECTED SUCCESSFULLY`);
//     })
//     .catch((error) => {
//         console.log(`DB CONNECTION FAILED`);
//         console.log(error);
//         process.exit(1);
//     })
// }


 async function connecting() {

    const response = await mongoose.connect(MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch(function(error) {
        console.log("DB CONNECTION FAILED : ",error);
        process.exit(1);
    })

    if(response) {
        console.log("DB CONNECTED Success");
    }
}

module.exports = connecting;








