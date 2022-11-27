const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()


app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xfjdabp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const mobileCollection = client.db('mobile-point').collection('mobile-collection');


        app.get('/allMobiles', async (req, res) => {
            const query = {};
            const cursor = mobileCollection.find(query);
            const mobiles = await cursor.toArray();
            res.send(mobiles);
        })
        app.get('/mobiles', async (req, res) => {
            const query = {};
            const cursor = mobileCollection.find(query);
            const mobiles = await cursor.limit(6).toArray();
            res.send(mobiles);
        })
        app.get('/allMobiles/:category', async (req, res) => {
            const category = req.params.category;
            console.log(req.params);
            const query = { category: category }
            const singleMobile = await mobileCollection.find(query).toArray();
            res.send(singleMobile);
        })
    }
    finally {

    }
}

run().catch(err => console.error(err));
app.get('/', (req, res) => {
    res.send('API is running')
})

app.listen(port, () => {
    console.log(`port is going on ${port}`);
})