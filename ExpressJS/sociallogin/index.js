const express = require('express');
const router = require('./routes/auth');
const {connectWithDB} = require('./database/database')
const passportConfig = require('./passport/passportConfig')
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

//TODO: connect with DB
connectWithDB()
.then(() => {
    app.listen(5000,() => {
        console.log("listening at port 5000...");
    })
})

app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "giventhedata",
    cookie: {
        name: "aryan",
        maxAge: 60000
    }
}))

app.use(passport.initialize(passportConfig));

app.set('view engine','ejs');
app.use("/auth",router);

app.get("/",(request,response) => {
    response.render("index");
})







