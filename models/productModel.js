const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const productSchema = new mongoose.Schema({
    categoryId: {
        type :ObjectId,
        ref : "category" ,
        required : [true , "Please , enter categoryId"] ,
        trim : true
    },
    title: {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required : true,
        trim : true
    },               // valid number/decimal
    isFreeShipping: {
        type : Boolean, 
        default: false
    },
    installments: {
        type : Number,
        required: true
    },
    deletedAt: {
        type: Date,
        default : ""
    }, 
    isDeleted: {
        type : Boolean, 
        default: false}
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema)