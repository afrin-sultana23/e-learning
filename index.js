const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const axios = require('axios');

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.xyowg5n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`

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
       // await client.connect();

        const courseCollection = client.db("upFluentDB").collection("courses");
        const cartCollection = client.db("upFluentDB").collection("enrolls")
        const userCollection = client.db("upFluentDB").collection("users");

        app.post("/", async (req, res) => {

            const {email, name} = req.body;
            const msg = JSON.stringify({
                "Messages": [{
                    "From": {"Email": "afrinsultana1337@gmail.com", "Name": "Automated Mail - UpFluent Email"},
                    "To": [{"Email": email, "Name": name}],
                    "Subject": "THANKS FOR SUBSCRIBE !!!",
                    "TextPart": "Welcome to upfluent."
                }]
            });
            
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '3600',
                'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
                'Cross-Origin-Resource-Policy': 'same-origin',
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp',
                'Content-Security-Policy': "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
                'X-XSS-Protection': '1; mode=block'
            };

            const config = {
                method: 'post',
                url: 'https://api.mailjet.com/v3.1/send',
                data: msg,
                headers: headers,
                auth: {username: 'ff7352a7ecdf4a3106a3b7d241829615', password: 'b0ac5d2c8832fcb346733ad3233d301b'},
            };
        
            try {
                const response = await axios(config);
                console.log(JSON.stringify(response.data));
                return response.data;
            } catch (error) {
                console.error('Error sending email:', error);
                throw error;
            }
        });

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        app.post("/users", async (req, res) => {
            const newItem = req.body;
            const result = await userCollection.insertOne(newItem)
            res.send(result);
        })

        app.get("/courses", async (req, res) => {
            const result = await courseCollection.find().toArray()
            res.send(result);
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
    res.send("Welcome to the SERVER us!");
})

app.listen(port, () => {
    console.log(`UP FLUENT is running on port ${port}`);
})