const express = require('express');
const format = require('date-format');

const app = express();
const PORT = 4000 || process.env.PORT;

//TODO: swagger related
const swaggerUI = require('swagger-ui-express');  // npm 
const fs = require('fs');
const YAMl = require('yaml');   // using yaml file for documentation..

const file = fs.readFileSync('./swagger.yaml','utf-8');
const swaggerDocument = YAMl.parse(file);

app.use('/socialapp-api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));




//FIXME: Defining the ROUTE for SocialApp

app.get("/",(request,response) => {
    //response.send("<h1> Hello from FrontMan</h1>");
    response.status(200).send("<h1> Hello from FrontMan</h1>");
    
})

//TODO: Route for linkedin
app.get("/api/v1/linkedin",(request,response) => {
    const socialLinkedin = {
        "username" : "AryanSanjayTapre",
        "followers": 727,
        "follow" : 202,
        "date" : format.asString('dd/MM/yyyy - hh:mm:ss',new Date())
    }; 

    response.status(200).send(socialLinkedin);

});

//TODO: route for facebook
app.get("/api/v1/facebook",(request,response) => {
    const socialFacebook = {
        "username":"AryanTapre",
        "followers":50,
        "follows":70,
        "date": format.asString('dd/MM/yyyy - hh:mm:ss',new Date())
    };

    response.status(200).send(socialFacebook);
}); 

//TODO: route for instagram
app.get("/api/v1/instagram",(request,response) => {
    const socialInstagram = {
        "username":"aryan.tapre.7",
        "followers":556,
        "follows":45,
        "date":format.asString('dd/MM/yyyy - hh:mm:ss', new Date())
    };

    response.status(200).send(socialInstagram);
});

//TODO: return whats so ever in URL
app.get("/api/v1/:token",(request,response) => {
    const token = request.params.token;
    const tokenData = {
        "parameter":token
    };

    response.status(200).send(tokenData);
});

app.listen(PORT, () => {
    console.log(`server is running at PORT ${PORT}`);
})