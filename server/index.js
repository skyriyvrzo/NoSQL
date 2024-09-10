const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const superStoreSchema = require('./superStoreSchema')

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json())

app.listen(port, async () => {
    console.log(`Server is running (PORT: ${port})`);
    await mongoose.connect('mongodb+srv://root:Qwerty@cluster0.babnd6h.mongodb.net/mut');
});

app.get('/', (req, res) => {
    res.send("");
});

app.get('hello', (req, res) => {
    res.send("Hello World");
});

app.get('/getAllData', async(req, res) => {
    const { recordPerPage, pageNo, orderId, country, productName } = req.query;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const totalRecords = await superStores.find({
        "Order ID": {
            $regex: `.*${orderId || ''}.*`
        },
        "Country/Region": {
            $regex: `.*${country || ''}.*`
        },
        "Product Name": {
            $regex: `.*${productName || ''}.*`
        }
    }).countDocuments();
    const data = await superStores.find({
        "Order ID": {
            $regex: `.*${orderId || ''}.*`
        },
        "Country/Region": {
            $regex: `.*${country || ''}.*`
        },
        "Product Name": {
            $regex: `.*${productName || ''}.*`
        }
    })
                                .skip((pageNo - 1) * recordPerPage)
                                .limit(recordPerPage);
    res.json({
        data: data,
        totalRecords: totalRecords
    });
});

app.get('/getField', async (req, res) => {
    res.json([
        {name: "Category", type: "String"},
        {name: "City", type: "String"},
        {name: "Country/Region", type: "String"},
        {name: "Customer ID", type: "String"},
        {name: "Customer Name", type: "String"},
        {name: "Discount", type: "Number"},
        {name: "Order Date", type: "Date"},
        {name: "Order ID", type: "String"},
        {name: "Product ID", type: "String"},
        {name: "Product Name", type: "String"},
        {name: "Profit", type: "Number"},
        {name: "Quamtity", type: "Number"},
        {name: "Region", type: "String"},
        {name: "Row ID", type: "Number"},
        {name: "Sale", type: "Number"},
        {name: "Segment", type: "String"},
        {name: "Ship Date", type: "Date"},
        {name: "Ship Mode", type: "String"},
        {name: "State", type: "String"},
        {name: "Sub-Category", type: "String"},
    ]);
});

app.post('/createProduct', async(req, res) => {
    const params = req.body;
    const superStores = mongoose.model("Superstores", superStoreSchema.superStoreSchema);
    const model = new superStores(params);
    model.save();
    res.json({
        status_code: model ? 200 : 500
    });
});

app.put('/editProduct/:_id', async(req, res) => {
    const {_id} = req.params;
    const params = req.body;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const model = await superStores.findByIdAndUpdate(_id, params);
    res.json({
        status_code: model ? 200 : 500
    });
});

app.delete('/deleteProduct/:_id', async(req, res) => {
    const {_id} = req.params;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const model = await superStores.findByIdAndDelete(_id);
    res.json({
        status_code: model ? 200 : 404
    });
});

app.get('/getData/:_id', async(req, res) => {
    const { _id } = req.params;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const data = await superStores.findOne({
        "_id": _id
    });
    res.json(data);
});

app.get('/getOrders', async(req, res) => {
    const { recordPerPage, pageNo } = req.query;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const data = await superStores.aggregate([
        {
            "$group": {
                "_id": "$Order ID",
                "Orders": {
                    "$push": {
                        //"_id": "$_id",
                        //"Row ID": "$Row ID",
                        "Order ID": "$Order ID",
                        "Ship Mode": "$Ship Mode",
                        "Customer ID": "$Customer ID",
                        "Customer Name": "$Customer Name",
                        "Segment": "$Segment",
                        "City": "$City",
                        "State": "$State",
                        "Country/Region": "$Country/Region",
                        "Region": "$Region",
                        "Order Date": "$Order Date",
                        "Ship Date": "$Ship Date",
                        "Product ID": "$Product ID",
                        "Category": "$Category",
                        "Sub-Category": "$Sub-Category",
                        "Product Name": "$Product Name",
                        "Sales": "$Sales",
                        "Quantity": "$Quantity",
                        "Discount": "$Discount",
                        "Profit": "$Profit"
                    }
                }
            }
        },
        {
            "$project": {
                "Order ID": "$_id",
                "Orders": 1,
                "_id": 0
            }
        },
        { "$skip": ((pageNo - 1) * recordPerPage) },
        { "$limit": parseInt(recordPerPage) },
    ])
    const totalRecords = await superStores.aggregate([
        {
            "$group": {
                "_id": "$Order ID",
                "Orders": {
                    "$push": {
                        "_id": "$_id",
                        "Row ID": "$Row ID",
                        "Order ID": "$Order ID",
                        "Order Date": "$Order Date",
                        "Ship Date": "$Ship Date",
                        "Ship Mode": "$Ship Mode",
                        "Customer ID": "$Customer ID",
                        "Customer Name": "$Customer Name",
                        "Segment": "$Segment",
                        "City": "$City",
                        "State": "$State",
                        "Country/Region": "$Country/Region",
                        "Region": "$Region",
                        "Product ID": "$Product ID",
                        "Category": "$Category",
                        "Sub-Category": "$Sub-Category",
                        "Product Name": "$Product Name",
                        "Sales": "$Sales",
                        "Quantity": "$Quantity",
                        "Discount": "$Discount",
                        "Profit": "$Profit"
                    }
                }
            }
        },
        {
            $count: "result"
        },
    ]);
    res.json({
        data: data,
        totalRecords: totalRecords[0].result
    });
});

app.get('/chartSaleAndProfit', async (req, res) => {
    const {year} = req.query;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const result = await superStores.aggregate([
        {
            $project: {
                "Product Name": 1,
                _id: 0,
                "Order Date": 1,
                "Sales": 1,
                "Profit": 1,
            }
        },
        {
            $group: {
                _id: {
                    month: {
                        $month: "$Order Date"
                    },
                    year: {
                        $year: "$Order Date"
                    }
                },
                total_sales: {
                    $sum: "$Sales"
                },
                total_profits: {
                    $sum: "$Profit"
                }
            }
        },
        {
            $match: {
                "_id.year": {
                    $ne: null,
                    $eq: parseInt(year)
                }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);
    res.json(result)
});

app.get('/getYear', async (req, res) => {
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const result = await superStores.aggregate([
        {
            $project: {
                _id: 0,
                "Order Date": 1,
            }
        },
        {
            $group: {
                _id: {
                    year: {
                        $year: "$Order Date"
                    }
                }
            }
        },
        {
            $match: {
                "_id.year": {
                    $ne: null,
                }
            }
        },
        {
            $sort: {
                "_id.year": 1,
            }
        }
    ]);
    res.json(result.map(e1 => e1._id.year));
});

app.get('/chartTopTen', async (req, res) => {
    const {year, month} = req.query;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const result = await superStores.aggregate([
        {
            $project: {
                "Product Name": 1,
                _id: 0,
                "Order Date": 1,
                "Quantity": 1,
            }
        },
        {
            $group: {
                _id: {
                    productName: "$Product Name",
                    year: {$year: "$Order Date"},
                    month: {$month: "$Order Date"}
                },
                total_quantity: {$sum: "$Quantity"}
            }
        }, {
            $match: {
                "_id.year": {
                    $ne: null,
                    $eq: parseInt(year),
                },
                "_id.month": {
                    $ne: null,
                    $eq: parseInt(month),
                }
            }
        },
        {
            $sort: {
                "total_quantity": -1
            }
        }
    ]).limit(10);
    res.json(result)
});

app.get('/topTenDetail', async (req, res) => {
    const { year, month, productName } = req.query;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const result = await superStores.aggregate([
        {
            $project: {
                _id: 0,
                "Order ID": 1,
                "Order Date": 1,
                "Product ID": 1,
                "Product Name": 1,
                "Sales": 1,
                "Profit": 1,
                "Quantity": 1
            }
        },
        {
            $match: {
                $expr: {
                    $and: [
                        { $eq: [{$year: "$Order Date"}, parseInt(year)] },
                        { $eq: [{$month: "$Order Date"}, parseInt(month)] }
                    ]
                },
                "Product Name": productName
            }
        },
    ]);
    res.json(result)
});

module.exports = app;