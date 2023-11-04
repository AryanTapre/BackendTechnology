const mongoose = require('mongoose');
const connectWithDB = () => {
    mongoose.connect(process.env.MONOGODB_CONNECTION_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("CONNECTED WITH mongoDB");
    })
    .catch((err) => {
        console.log(`FAILED TO CONNECT WITH MONGODB: ${err}`)
        process.exit(1);
    })
}
module.exports = connectWithDB;