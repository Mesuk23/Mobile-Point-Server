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
        const userCollection = client.db('mobile-point').collection('user-collection');



        const verifyAdmin = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await userCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }


        app.get('/allMobiles', async (req, res) => {
            const query = {};
            const cursor = mobileCollection.find(query);
            const mobiles = await cursor.toArray();
            res.send(mobiles);
        })
        app.get('/allProducts', async (req, res) => {
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
        app.get('/allProducts/:email', async (req, res) => {
            const email = req.params.email;
            console.log(req.params);
            const query = { email: email }
            const singleMobile = await mobileCollection.find(query).toArray();
            res.send(singleMobile);
        })
        app.post('/allMobiles', async (req, res) => {
            const mobiles = req.body;
            const result = await mobileCollection.insertOne(mobiles);
            res.send(result);
        })
        app.delete('/allMobiles/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await mobileCollection.deleteOne(query);
            res.send(result);
        })
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await userCollection.insertOne(users);
            res.send(result);
        })
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await userCollection.findOne(query);
            res.send(result);
        })
        app.get('/seller/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });

        })
        app.get('/seller/isseller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === 'Seller' });

        })
        app.get('/seller/isuser/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isUser: user?.role === 'User' });

        })
        app.put('/seller/admin/:id', verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        app.get('/seller', async (req, res) => {
            const query = { $or: [{ role: 'Seller' }, { role: 'admin' }] };
            const result = await userCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/user', async (req, res) => {
            const query = { role: 'User' };
            const result = await userCollection.find(query).toArray();
            res.send(result);
        })
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        app.delete('/seller/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
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