const app = require('./config/app');
const connectWithDB = require('./config/database');
const cloudinary = require('cloudinary');
require('dotenv').config()

connectWithDB(); // connecting with db

//cloudinary connect....
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUDNAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})


app.listen(process.env.SERVER_PORT,() => {
    console.log(`server is up at port:${process.env.SERVER_PORT}`);
})
