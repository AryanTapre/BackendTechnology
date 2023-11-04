//FIXME: Promise handling in MONGOOSE

const myUser = {
    name:"aryan",
    age:21
};

const saveUser = async(req,res) => {
    try {
        const user = await User.create(myUser);

    } catch (error) {
        console.log(error);
    }
    return user;
}

const BigPromise = saveUser => (req,res,next) => {
    Promise.resolve(saveUser(req,res,next))
    .then(next());
}
BigPromise(saveUser,req,res,next);

const bigPromise = (saveUser,req,res,next) => {
    Promise.resolve(saveUser(req,res,next))
    .catch(next());
}