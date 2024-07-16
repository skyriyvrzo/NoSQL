const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const superStoreSchema = require('./superStoresSchema');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.listen(port, async() => {
    console.log(`Server is running (Port: ${port})`);

    await mongoose.connect('mongodb+srv://root:Qwerty@cluster0.babnd6h.mongodb.net/mut')
});

app.get('/', (req, res) => {
   res.send("java.lang.NullPointerException"); 
});

app.get('/hello', (req, res) => {
    res.send("Hello World");
});

app.get('/getAllData', async (req, res) => {
    const superStores = mongoose.model("SuperStores", superStoreSchema.superStoresSchema);
    const data = await superStores.find({});
    res.send(data);
});

module.exports = app;