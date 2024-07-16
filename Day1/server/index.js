const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const superStoreSchema = require('./superStoreSchema')
const app = express()
const port = 5000

app.use(cors());
app.use(express.json());

app.listen(port, async () => {
    console.log(`Server is runing (Port: ${port})`);

    await mongoose.connect('mongodb+srv://root:Qwerty@cluster0.babnd6h.mongodb.net/mut')
});

app.get('/', (req, res) => {
    res.send("");
});

app.get('/hello', (req, res) => {
    res.send("Hello World");
});

app.get('/getAllData', async (req, res) => {
    const {recordPerPage, pageNo, orderId, country, product} = req.query;
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoresSchema);
    const totalRecords = await superStores.find({
        "Order ID" : {
            $regex: `.*${orderId || ''}.*`
        },

        "Country/Region" : {
            $regex: `.*${country || ''}.*`
        },

        "Product Name" : {
            $regex: `.*${product || ''}.*`
        }
    }).countDocuments();
    const data = await superStores.find({
        "Order ID" : {
            $regex: `.*${orderId || ''}.*`
        },
        
        "Country/Region" : {
            $regex: `.*${country || ''}.*`
        },

        "Product Name" : {
            $regex: `.*${product || ''}.*`
        }
    })
                        .skip((pageNo - 1) * recordPerPage)
                        .limit(recordPerPage);
    res.json({
        data: data,
        totalRecords: totalRecords
        });
})

module.exports = app;