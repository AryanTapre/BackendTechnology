const jwt = require('jsonwebtoken');

const auth = (request,response,next) => {
    try {
        const token = request.cookie.token ||  
                     request.body.token ||
                     request.header("Authorization").replace("Bearer ","")   
        
        if(!token) {
            return response.status(403).send("token is missing")
        }

    
        // verify the token
        const decode = jwt.verify(token,process.env.SECRET_KEY);
        console.log(decode);
        

    } catch (error) {
        // token not verified
        return response.status(401).send("invalid token");
    }
    next();
}

module.exports = auth;


















