require('dotenv').config();

const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})




//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"             // imp for cloudinary part
}));
app.set("view engine",'ejs');         // ejs is middleware, we need to Set It!.


app.get("/myget",(req,res) => {
    console.log(req.query); // if form made using templating engine, then data comes in params/query
    res.send(req.query);
})

app.post("/mypost",async(req,res) => {
    console.log(req.body);
    console.log(req.files);

//TODO: Handling- multiple files
    let imageArray = [];
    let result;

    const files = req.files.samplefile;

    if(files) {

        for (let index = 0; index < files.length; index++) {
            result = await cloudinary.uploader.upload(files[index].tempFilePath,{
               folder: "Users",
               public_id: files[index].name
           }).catch(err=>console.log(err))
           
           imageArray.push({
               public_id: result.public_id,
               secure_url: result.secure_url
           })
   
           let path = __dirname +"/images/"+files[index].name;
           let file = files[index];
           file.mv(path,(err) => {
               if(err) {
                   return res.status(500).send(err);
               }
               //res.status(200).send("file uploaded successfully");
           })
       }

    }
    
//TODO: Handling - single file
//    let file = req.files.samplefile;

//     //moving file to CLOUDINARY 
//     const result = await cloudinary.uploader.upload(file.tempFilePath,{
//         folder: "Users",
//         public_id: file.name
//     }).catch(err => console.log(err))

//     console.log(result);


    const data = new Object({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        samplefile: req.files.samplefile,
        result,
        imageArray
    });
    
    
//     const path = __dirname + "/images/" + req.files.samplefile.name;
//     file.mv(path,(err) => {
//         if(err) {
//             return res.status(500).send(err);
//         }
//         res.status(200).send("file uploaded successfully");
//     })

    console.log(data);
    res.send(data);
})

app.get("/getdata",(request,response) => {
     response.render("getForm");
    
})

app.get("/postdata",(request,response) => {
    response.render("postForm");
})


// app.get("/myget",(req,res) => {
//     console.log(req.body);
//     res.send(req.body);
// })

app.listen(process.env.PORT,() => {
    console.log(`server running at port:${process.env.PORT}`);
})

