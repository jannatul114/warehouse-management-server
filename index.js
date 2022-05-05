const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// moddlewares
require('dotenv').config()
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xjjrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const fruitsCollection = client.db("inventoryItems").collection("item");

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

        //posting items
        app.post('/allfruits', async (req, res) => {
            const newItem = req.body;
            const result = await fruitsCollection.insertOne(newItem);
            res.send(result);
        })

        //updating updating
        app.put('/allfruits/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItems = req.body;
            const filtering = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: updatedItems
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