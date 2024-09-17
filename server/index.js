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

app.use("", require('./superStoreRoute'))
app.use("/product", require('./productRoute'))

module.exports = app;