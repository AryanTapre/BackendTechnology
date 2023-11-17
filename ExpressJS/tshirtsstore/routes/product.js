const {customRole,userMiddleware} = require('../middlewares/user')

const  express = require('express');
const productRouter = express.Router();

const {
    adminnewProduct,
    getProductDetails,
    adminGetProduct,
    getOneProduct,
    adminUpdateProduct,
    adminDeleteProduct
} = require('../controllers/productController')


productRouter.route("/get/product").get(getProductDetails)
productRouter.route("/get/product/:id").get(getOneProduct)


//TODO: ADMIN routes
productRouter.route("/admin/newproduct").post(userMiddleware,customRole('admin'),adminnewProduct);
productRouter.route("/admin/get/product").get(userMiddleware,customRole('admin'),adminGetProduct)
productRouter.route("/admin/update/product/:id").post(userMiddleware,customRole('admin'),adminUpdateProduct)
productRouter.route("/admin/delete/product/:id").get(userMiddleware,customRole('admin'),adminDeleteProduct)

module.exports = {productRouter}