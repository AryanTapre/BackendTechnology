const {customRole,userMiddleware} = require('../middlewares/user')

const  express = require('express');
const productRouter = express.Router();

const {newProduct,getProductDetails} = require('../controllers/productController')

productRouter.route("/admin/newproduct").post(userMiddleware,customRole('admin'),newProduct);
productRouter.route("/get/product").get(getProductDetails)

module.exports = {productRouter}