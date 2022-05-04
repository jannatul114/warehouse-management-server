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




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})