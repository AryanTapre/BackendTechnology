
// const customError = require('./utils/CustomError');

// const bigPromise = require('./middlewares/bigPromise');

// const fetch_url = "https://jsonplaceholder.typicode.com/users/";

// bigPromise(async () => {
//     const result = await fetch(fetch_url);
//     const err = new Error("hello i am error");
//     console.log(err);
//     const data = await result.json();
//     console.log(data);
// })

const bcrypt = require('bcryptjs');
const pr = new Promise((resolve,reject) => {
    resolve(bcrypt.hash("1234",10))
})
const Password = pr
Password.then(() => {
    console.log(Password);
})

const user = "1234";

const isValidatePassword = (Password) => {
    return bcrypt.compare(Password,user)? true: false;
}

console.log(isValidatePassword(Password));


const obj = 