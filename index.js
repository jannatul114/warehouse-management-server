const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// moddlewares
require('dotenv').config()
app.use(cors())
app.use(express.json());


//OizTQOmb568WN0uV
//allFruits

//fruits
//B7quVO9XMUTOCc1H



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xjjrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const fruitsCollection = client.db("inventoryItems").collection("item");


        app.get('/allfruits', async (req, res) => {
            const quary = {};
            const cursor = fruitsCollection.find(quary);
            const result = await cursor.toArray();
            res.send(result);
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})