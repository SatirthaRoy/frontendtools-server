const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const cookeParser = require('cookie-parser');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@mydatabase.ofrvnz1.mongodb.net/?retryWrites=true&w=majority&appName=mydatabase`;

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

    const database = client.db('frontend_tools');
    const tools = database.collection('tools');

    // jwt token generate
    app.post('/jwt', async(req, res) => {
      const user = req.body;
      const token =  jwt.sign(user, process.env.SECRET, {expiresIn: '1h'})
      res.send(token);
    })


    // get all the docs
    app.get('/', async(req, res) => {
      const cursor = tools.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // add a tool
    app.post('/add', async(req, res) => {
      const tool = req.body;
      console.log('tool: ', tool);
      const result = await tools.insertOne(tool);
      res.send(result);
    })

    // get a single tool to update it

    app.get('/update/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await tools.findOne(query);
      res.send(result);
    })

    // update a single data
    app.patch('/update/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const updatedTool = req.body
      const updatedData = {
        $set: {
          name: updatedTool.name,
          img_link: updatedTool.img_link,
          link: updatedTool.link,
          category: updatedTool.category
        }
      }
      const result = await tools.updateOne(query, updatedData)
      res.send(result);
    })

    // delete a single data
    app.delete('/delete/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await tools.deleteOne(query);
      res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port);