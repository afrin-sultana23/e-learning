const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.xyowg5n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const courseCollection = client.db("upFluentDB").collection("courses");
        const cartCollection = client.db("upFluentDB").collection("enrolls")


        app.get("/courses", async (req, res) => {
            //const result = await courseCollection.find().toArray()

            res.send("test ");
        })

        app.post("/courses", async (req, res) => {
            const newItem = req.body;
            const result = await courseCollection.insertOne(newItem)
            res.send(result);
        })

        app.delete('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await courseCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/cart', async (req, res) => {
            const item = req.body
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })

        app.get('/cart', async (req, res) => {
            const result = await cartCollection.find().toArray();
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Welcome to the SERVER!");
})

app.listen(port, () => {
    console.log(`UP FLUENT is running on port ${port}`);
})