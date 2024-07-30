const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const superStoreSchema = require('./superStoreSchema')

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.listen(port, async () => {
    console.log(`Server is running (PORT: ${port})`);
    // ALT + 9 + 6
    await mongoose.connect('mongodb+srv://root:Qwerty@cluster0.babnd6h.mongodb.net/mut')
});

app.get('/', (req, res) => {
    res.send("");
});

app.get('/hello', (req, res) => {
    res.send("Hello World");
});

app.get('/getField', async (req, res) => {
    res.json([
        {name: "Category", type: "String"},
        {name:"City", type: "String"},
        {name:"Country/Region", type: "String"},
        {name:"Customer ID", type: "String"},
        {name:"Customer Name", type: "String"},
        {name:"Discount", type: "Number"},
        {name:"Order Date", type: "Date"},
        {name:"Order ID", type: "String"},
        {name:"Product ID", type: "String"},
        {name:"Product Name", type: "String"},
        {name:"Profit", type: "Number"},
        {name:"Quantity", type: "Number"},
        {name:"Region", type: "String"},
        {name:"Row ID", type: "Number"},
        {name:"Sales", type: "Number"},
        {name:"Segment", type: "String"},
        {name:"Ship Date", type: "Date"},
        {name:"Ship Mode", type: "String"},
        {name:"State", type: "String"},
        {name:"Sub-Category", type: "String"},
    ]);
});

app.post('/createProduct', async(req, res) => {
    const params = req.body;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
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

app.get('/getAllData', async (req, res) => {
    const { recordPerPage, pageNo, orderId, country, productName } = req.query;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const totalRecords = await superStores.find({
        "Order ID": {
            $regex: `.*${orderId || ''}.*`      // where orderId like '%'+orderId+'%'
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
            $regex: `.*${orderId || ''}.*`      // where orderId like '%'+orderId+'%'
        },
        "Country/Region": {
            $regex: `.*${country || ''}.*`
        },
        "Product Name": {
            $regex: `.*${productName || ''}.*`
        }
    })
                        .skip((pageNo - 1) * recordPerPage) // 0
                        .limit(recordPerPage);  // pageNo = 2, recordPerPage = 10
    res.json({
        data: data,
        totalRecords: totalRecords
    });
});

app.get('/getData/:_id', async (req, res) => {
    const {_id} = req.params;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoreSchema);
    const data = await superStores.findOne({
        "_id" : _id
    });

    res.json(data);
})

module.exports = app;