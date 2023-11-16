const bigPromise = require('../middlewares/bigPromise');
const cloudinary = require('cloudinary').v2;
const CustomError = require('../utils/CustomError');
const Product = require('../models/Product');
const WhereClause = require('../utils/WhereClause')

const newProduct = async (request,response,next) => {

    const productName  = request.body.name;
    const productPrice = request.body.price;
    const productDescription = request.body.description;
    const productPhotos = request.files.photos;
    const productCategory = request.body.category;
    const productBrand = request.body.brand;
    const productStock = request.body.stock;
    const productManageUser = request.userID;

    if(!(productName && productPrice && productDescription && productPhotos && productCategory && productBrand && productStock && productManageUser)) {
        console.log(`all field are mandatory for adding new product onto database`)
        return next(response.status(401).json({
            success: false,
            message: new CustomError("all field are mandatory for adding new product onto databaseMedia","all field are mandatory for adding new product onto databaseMedia",401)
        }))
    }

    //moving all photos to cloudinary && Server
    let productImages = [];
    for (let index = 0; index < productPhotos.length; index++) {
        try{
            const cloudinaryResult = await cloudinary.uploader.upload(productPhotos[index].tempFilePath,{
                folder: "Product"})

            productImages.push({
                id: cloudinaryResult.public_id,
                secure_url: cloudinaryResult.secure_url
            })

            let file = productPhotos[index];
            let path =  __dirname + "/../databaseMedia/products/" + file.name;
            await file.mv(path,(error) => {
                if(error) {
                    console.log(`failed to upload photo to server : ${error}`)
                    return next(response.status(501).json({
                        success: false,
                        message: new CustomError("failed to upload photo to server","failed to upload photo to server",501)}))
                }
            })

        }
        catch(error) {
            console.log(`error in uploading photo to Cloudinary -> ${error}`)
        }

    }

    const product = await Product.create({
        name:productName,
        price: productPrice,
        description: productDescription,
        photos: productImages,
        category: productCategory,
        brand: productBrand,
        stock: productStock,
        user: productManageUser
    })

    response.status(201).json({
        success: true,
        product
    })
}


const getProductDetails = async (request,response,next) => {
    const clause = new WhereClause(Product.find(),request.query);
    const totalProductCount = await Product.countDocuments();

    const product = clause.search()
                    clause.filter()
                    clause.pagination(request.query.limit? request.query.limit : 1);

    console.log("product info=>",product);

    const filteringData = product._conditions
    const page = {...product.options}

    console.log("data is => ",filteringData)
    console.log("page is => ",page)

    let data = new Object({...filteringData});

    console.log("final data: ",data)

    const fetchedProducts = await  Product.find({...data}).limit(page.limit).skip(page.skip);

    response.status(200).json({
        success: true,
        totalProductCount,
        totalFilteredProductCount: fetchedProducts.length,
        fetchedProducts
    })

}

exports.newProduct = bigPromise(newProduct);
exports.getProductDetails = bigPromise(getProductDetails);