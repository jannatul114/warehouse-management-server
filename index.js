const express = require('express')
const cors = require('cors');
const app = express()
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// moddlewares
require('dotenv').config()
app.use(cors())
app.use(express.json());


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xjjrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const fruitsCollection = client.db("inventoryItems").collection("item");


        //jwt token implementing
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            })
            res.send({ accessToken })
        })


        //getting all item
        app.get('/allfruits', async (req, res) => {

            const quary = {};
            const cursor = fruitsCollection.find(quary);
            const result = await cursor.toArray();
            res.send(result);
        })

        //getting specific item
        app.get('/allfruits/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            const cursor = await fruitsCollection.findOne(quary);
            res.send(cursor);
        })

        //deleting specific item
        app.delete('/allfruits/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            const result = await fruitsCollection.deleteOne(quary);
            res.send(result);
        })

        app.delete('/usersfruits/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            const result = await fruitsCollection.deleteOne(quary);
            res.send(result);
        })

        //posting items
        app.post('/allfruits', async (req, res) => {
            const newItem = req.body;
            const result = await fruitsCollection.insertOne(newItem);
            res.send(result);
        })


        //getting items
        app.get('/usersfruits', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const quary = { email: email };
                const cursor = fruitsCollection.find(quary);
                const result = await cursor.toArray();
                res.send(result);
            }

            else {
                res.status(403).send({ message: 'Forbidden access' })
            }

        })
        //posting user items
        app.post('/usersfruits', async (req, res) => {
            const newItem = req.body;
            const result = await fruitsCollection.insertOne(newItem);
            res.send(result);
        })

        //updating 
        app.put('/allfruits/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItems = req.body;
            const filtering = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {

                $set: {
                    name: updatedItems.name,
                    price: updatedItems.price,
                    quantity: updatedItems.quantity,
                    img: updatedItems.img,
                    description: updatedItems.description,
                    supplier: updatedItems.supplier,
                }
            }
            const result = await fruitsCollection.updateOne(filtering, updatedDoc, options);
            res.send(result);
        })

    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})