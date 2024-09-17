const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema ({
    "Category": String,
    "Product ID": String,
    "Product Name": String,
    "Price": Number,
    "Sub-Category": String,
})

module.exports = {
    productSchema: productSchema
}