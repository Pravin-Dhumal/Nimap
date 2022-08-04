const mongoose = require('mongoose')

const categorySchema= new mongoose.Schema ({
    categoryName:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports= mongoose.model('category',categorySchema)