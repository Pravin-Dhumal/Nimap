const mongoose = require('mongoose');
const productModel = require("../models/productModel")
const categoryModel = require("../models/categoryModel")


const isValid = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') {
      return false
    }
    if (typeof (value) === 'string' && value.trim().length > 0) {
      return true
    }
    if (typeof value === 'number' && value.toString().trim().length > 0) {
      return true
    }
  }

  const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
}
//--- Create Product ----------------------------------------------------------------------------------------------------------------------------------------------------

const createProduct = async function (req, res) {
    try {
        const data = req.body;
        let {categoryId,title, price,isFreeShipping,installments } = data;
        
        //  check : user doesn't provide any data
        if (!(Object.keys(data).length) > 0) {
        res.status(400).send({ status: false, message: "Please , provide some data" })
        return
        }
         
        if (!isValid(categoryId)) {
            res.status(400).send({ status: false, message: 'categoryId is required' })
            return
        }

        if (!isValidObjectId(categoryId)) {
            return res.status(404).send({ status: false, message: "Invalid Id..!!" })
        }

        if(!isValid(data.title)){
            return res.status(400).send({status:false,messege:"Please,Provide product title"})
        };
        
        if (!isValid(data.price)) {
            return res.status(404).send({ status: false, message: "Please Provide price of product"})
        };

        if (!isValid(data.isFreeShipping)) {
            return res.status(404).send({ status: false, message: "Please Provide product shipping is free or not"})
        };

        if (!isValid(data.installments)) {
            return res.status(404).send({ status: false, message: "Please Provide product installments"})
        };

        const newProduct = await productModel.create(data)
        res.status(201).send({ status: true, data: newProduct });

    } 
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message })
    }
}

const getProductById = async function (req, res) {

    try {
        const productId = req.params.productId;

         //  check : if there is no productId in path params
    if (Object.keys(productId)==0) {
        res.status(400).send({ status: false, message: "Please , provide productId in path params" })
        return
      }

      //  check : if invalid productId
    if (!(/^[0-9a-fA-F]{24}$/.test(productId))) {
        res.status(400).send({ status: false, message: 'please provide valid productId' })
        return
      }

      //  retreive : details of product that statisfies given filters
    const product = await productModel.findOne({ _id: productId, isDeleted: false })
    console.log("product",product)

    //  if no data found by given Id 
    if (!product) {
        res.status(404).send({ status: false, message: "No data found" })
        return
      }

   res.status(200).send({ status: true, message: "product List", data: product  })
    return
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}
      
const updateProduct = async function (req, res) {
    try {
        // let data = req.body;
        // const id = req.params.productId;
        const productId = req.params.productId
        const dataForUpdation = req.body

        //  check : if there is no productId in path params
    if (Object.keys(productId)==0) {
        res.status(400).send({ status: false, message: "Please , provide productId in path params" })
        return
      }
      //  check : if invalid productId
      if (!(/^[0-9a-fA-F]{24}$/.test(productId))) {
        res.status(400).send({ status: false, message: 'please provide valid productId' })
        return
      }

      //  check : validations on given data for updates

    //  product Name :  provided but empty 
    if (dataForUpdation.title != null) {
        if (!isValid(dataForUpdation.title)) {
          res.status(400).send({ status: false, message: 'please provide product Name' })
          return
        }
  
       
      }

    

      //  retreive : details of product
    const product = await productModel.findOne({ _id: productId, isDeleted: false })

    //  check : if no data found by given Id 
    if (!product) {
      res.status(404).send({ status: false, message: "No data found" })
      return
    }
      
     //  Update : product by given details 
     const updatedproduct = await productModel.findByIdAndUpdate({ _id: productId },
        { ...dataForUpdation },
        { new: true })
  
  
      //  send : final response 
      return res.status(200).send({ status: true, message: "category updated successfully", data: updatedproduct })
    }
    catch (err) {
      console.log(err)
      res.status(500).send({ status: false, msg: err.message })
    }
  }


const deleteProductById = async function (req, res) {
    try {
      //  store : productId by params 
      const productId = req.params.productId
  
      //  check : if there is no productId in path params
      if (Object.keys(productId)==0) {
        res.status(400).send({ status: false, message: "Please , provide productId in path params" })
        return
      }
      //  check : if invalid productId
      if (!(/^[0-9a-fA-F]{24}$/.test(productId))) {
        res.status(400).send({ status: false, message: 'please provide valid product Id' })
        return
      }
  
      //  search : requested product 
      const product = await productModel.findById(productId)
  
      //  check : if doesn't exist 
      if (!product) {
        res.status(404).send({ status: false, message: "No data found" })
        return
      }
  
      //  check : if product is already deleted 
      if (product.isDeleted == true) {
        res.status(400).send({ status: false, message: "product is already deleted" })
        return
      }
  
      //  deleting : product
      const deletedproduct = await categoryModel.findOneAndUpdate({ _id: productId },
        { isDeleted: true, deletedAt: new Date() },
        { new: true })
  
    
  
      //  send : final response 
      res.status(200).send({ status: true, message: "product deleted successfully" })
      return
    }
    catch (err) {
      console.log(err)
      res.status(500).send({ status: false, msg: err.message })
    }
  }
const productsList = async function (req, res) {
    try {
        let { page, limit } = req.query;
        if (!page) page = 1;
        if (!limit) limit = 10;
        const skip = (page - 1) * 10;
        const products = await productModel.find().skip(skip).limit(limit).populate('categoryId', 'categoryName');

        return res.send({ page: page, limit: limit, productDetails: products })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

module.exports.createProduct = createProduct
module.exports.getProductById = getProductById
module.exports.updateProduct = updateProduct
module.exports.deleteProductById = deleteProductById
module.exports.productsList = productsList

