const express = require('express');
const router = express.Router();


const productController = require("../controllers/productController")
const categoryController = require("../controllers/categoryController")


// --- Product APIs --------------------------------------------------------------------------------------------------------------------------------------------
router.post("/product", productController.createProduct)
router.get("/products/:productId", productController.getProductById)
router.put("/products/:productId", productController.deleteProductById)
router.delete("/products/:productId", productController.deleteProductById)
router.get('/products', productController.productsList);

//--- Category APIs---------------------------------------------------------------------------------------------------------------------------------------------
router.post("/category" ,categoryController.createcategory)
router.get('/categories/:categoryId', categoryController.getCategoryById);
router.put("/categories/:categoryId",categoryController.updateCategory);
router.delete("/categories/:categoryId",categoryController.deleteCategoryById);

module.exports = router;