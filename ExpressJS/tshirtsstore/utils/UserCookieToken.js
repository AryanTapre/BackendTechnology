const cookieToken = (user,response) => {
    const userToken = user.getJwtToken();

    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    user.password = undefined;
    response.status(201).cookie('token',userToken,options).json({
        success: true,
        userToken,
        user
    })
}

module.exports = cookieToken;