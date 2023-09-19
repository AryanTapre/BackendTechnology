const express = require('express')
const app = express();
const PORT = 4000 || process.env.PORT

const swaggerUI = require('swagger-ui-express'); // For documentation purpose..
const YAML = require('yaml');
const fs = require('fs');

const file = fs.readFileSync('./swagger.yaml','utf-8');
const swaggerDocument = YAML.parse(file);

const fileUpload = require('express-fileupload');

// Middleware
app.use('/mydocs-api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));
app.use(express.json());
app.use(fileUpload());


let courses = [
    {
        id: 101,
        name: "backend technology",
        price: 699,
        validity: 365 
    },
    {
        id: 102,
        name: "cloud computing",
        price: 1000,
        validity: 489 
    },
    {
        id: 103,
        name: "solidity",
        price: 299,
        validity: 365 
    },
    {
        id: 104,
        name: "Angular",
        price: 10,
        validity: 789 
    },
    {
        id: 105,
        name: "ReactJS",
        price: 899,
        validity: 365 
    }
];


app.get("/",(request,response) => {
    response.status(200).send("<h1> Hello From FrontMan</h1>");
});


app.get("/api/v1/aryan",(request,response) => {
    response.status(200).send(`Hello from Aryan..`);
})


app.get("/api/v1/aryanObject",(request,response) => {
  
    const obj = {
        id: 111,
        name: "Backend program",
        price: 699
    };

    const jsonData = response.json(obj);
    response.status(200).send(jsonData);

});


app.get("/api/v1/courses",(request,response) => {
    
    response.status(200).send(courses);
})

//FIXME: Data is coming form URL
app.get("/api/v1/mycourse/:courseID",(request,response) => {

   const id = Number(request.params.courseID);
   const data = courses.find((element) => element.id === id);

   if(data == undefined) {
        response.status(200).send("<h3> Required course NOT present there! </h3>");
   } else {
        response.status(200).send(data);
   }

});

//FIXME: data is coming from request body
app.post("/api/v1/courses/new",(request,response) => {
    console.log(request.body);
    courses.push(request.body);
    response.send(request.body);
})

// Query String in URL
app.get("/api/v1/query",(request,response) => {
    let location = request.query.location;
    let device = request.query.device;
    
    const data = {
        location,
        device
    };

    response.status(200).send(data);
});

app.post("/api/v1/image",(request,response) => {
    console.log(request.headers);

    let file = request.files.imageFile;
    let path = __dirname + '/Resource/'+ file.name;    

    file.mv(path,(error) => {
        if(error) {
            return response.status(500).send("error");
        }
       
        response.status(200).send("<h1> file uploaded Successfully</h1>");
    });

});

app.listen(PORT, () => {
    console.log(`....server is running at PORT ${PORT}....`);
});

