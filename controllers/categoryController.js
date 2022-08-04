const mongoose = require('mongoose');
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");

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


const createCategory = async function (req, res) {
    try {
        const data = req.body;
        let {categoryName, description } = data;
        
        //  check : user doesn't provide any data
        if (!(Object.keys(data).length) > 0) {
        res.status(400).send({ status: false, message: "Please , provide some data" })
        return
        }

        if(!isValid(data.categoryName)){
            return res.status(400).send({status:false,messege:"Please,Provide Category Name"})
        };
        
        if (!isValid(data.description)) {
            return res.status(404).send({ status: false, message: "Please Provide Category description"})
        };

        const newCategory = await categoryModel.create(data)
        res.status(201).send({ status: true, data: newCategory });

    } 
    catch (error) {
        console.log(err)
        res.status(500).send({ status: false, message: error.message })
    }
}

const getCategoryById = async function (req, res) {

    try {
        const categoryId = req.params.categoryId;

         //  check : if there is no categoryId in path params
    if (Object.keys(categoryId)==0) {
        res.status(400).send({ status: false, message: "Please , provide categoryId in path params" })
        return
      }

      //  check : if invalid categryId
    if (!(/^[0-9a-fA-F]{24}$/.test(categoryId))) {
        res.status(400).send({ status: false, message: 'please provide valid categoryId' })
        return
      }

      //  retreive : details of category that statisfies given filters
    const category = await categoryModel.findOne({ _id: categoryId, isDeleted: false })
    console.log("category",category)

    //  if no data found by given Id 
    if (!category) {
        res.status(404).send({ status: false, message: "No data found" })
        return
      }

   res.status(200).send({ status: true, message: "category List", data: category  })
    return
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
  }
}
      
const updateCategory = async function (req, res) {
    try {
        // let data = req.body;
        // const id = req.params.categoryId;
        const categoryId = req.params.categoryId
        const dataForUpdation = req.body

        //  check : if there is no categoryId in path params
    if (Object.keys(categoryId)==0) {
        res.status(400).send({ status: false, message: "Please , provide categoryId in path params" })
        return
      }
      //  check : if invalid categoryId
      if (!(/^[0-9a-fA-F]{24}$/.test(categoryId))) {
        res.status(400).send({ status: false, message: 'please provide valid categoryId' })
        return
      }

      //  check : validations on given data for updates

    //  category Name :  provided but empty 
    if (dataForUpdation.categoryName != null) {
        if (!isValid(dataForUpdation.categoryName)) {
          res.status(400).send({ status: false, message: 'please provide category Name' })
          return
        }
  
        
      }

    

      //  retreive : details of category
    const category = await categoryModel.findOne({ _id: categoryId, isDeleted: false })

    //  check : if no data found by given Id 
    if (!category) {
      res.status(404).send({ status: false, message: "No data found" })
      return
    }
      
     //  Update : category by given details 
     const updatedcategory = await categoryModel.findByIdAndUpdate({ _id: categoryId },
        { ...dataForUpdation },
        { new: true })
  
  
      //  send : final response 
      return res.status(200).send({ status: true, message: "category updated successfully", data: updatedcategory })
    }
    catch (err) {
      console.log(err)
      res.status(500).send({ status: false, msg: err.message })
    }
  }


const deleteCategoryById = async function (req, res) {
    try {
      //  store : categoryId by params 
      const categoryId = req.params.categoryId
  
      //  check : if there is no categoryId in path params
      if (Object.keys(categoryId)==0) {
        res.status(400).send({ status: false, message: "Please , provide categoryId in path params" })
        return
      }
      //  check : if invalid categoryId
      if (!(/^[0-9a-fA-F]{24}$/.test(categoryId))) {
        res.status(400).send({ status: false, message: 'please provide valid CategoryId' })
        return
      }
  
      //  search : requested category 
      const category = await categoryModel.findById(categoryId)
  
      //  check : if doesn't exist 
      if (!category) {
        res.status(404).send({ status: false, message: "No data found" })
        return
      }
  
      //  check : if category is already deleted 
      if (category.isDeleted == true) {
        res.status(400).send({ status: false, message: "category is already deleted" })
        return
      }
  
      //  deleting : category
      const deletedcategory = await categoryModel.findOneAndUpdate({ _id: categoryId },
        { isDeleted: true, deletedAt: new Date() },
        { new: true })
  
      //  deleting : product for that category
      const deleteProduct = await productModel.updateMany({ categoryId: categoryId },
        { isDeleted: true }, { new: true })
  
      //  send : final response 
      res.status(200).send({ status: true, message: "category deleted successfully" })
      return
    }
    catch (err) {
      console.log(err)
      res.status(500).send({ status: false, msg: err.message })
    }
  }
  
module.exports.createcategory = createCategory
module.exports.getCategoryById = getCategoryById
module.exports.deleteCategoryById = deleteCategoryById
module.exports.updateCategory = updateCategory
