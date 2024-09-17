const express= require('express')
const app = express.Router()
const mongoose = require('mongoose')
const superStoreSchema = require('./superStoreSchema');
const productSchema = require('./productSchema');

app.get('/migrate', async(req, res) => {
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    
    const result = await superStores.aggregate([
        {
            "$group": {
                "_id": "$Product ID",
                "Product Name": {"$first": "$Product Name"},
                "Category": {"$first": "$Category"},
                "Sub-Category": {"$first": "$Sub-Category"},
                "Sales": {"$first": "$Sales"},
                "Discount": {"$first": "$Discount"},
                "Profit": {"$first": "$Profit"},
                "Quantity": {"$first": "$Quantity"},
            }
        },
        {
            "$project": {
                "Product ID": "$_id",
                "Product Name": 1,
                "Category": 1,
                "Sub-Category": 1,
                "Price": {
                    "$divide": [
                        {
                            "$subtract": [
                                {
                                    "$add": [
                                        { "$toDouble": "$Sales" },
                                        { "$toDouble": "$Discount" }
                                    ]
                                },
                                { "$toDouble": "$Profit" }
                            ]
                        },
                        { "$toDouble": "$Quantity" }
                    ]
                },
                "_id": 0
            }
        }
    ]);

    const products = mongoose.model("Products", productSchema.productSchema);
    await products.insertMany(result);
    res.json(result);
});

module.exports = app;