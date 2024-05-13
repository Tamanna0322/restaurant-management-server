const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wytdrq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
     
     const restaurantCollection = client.db('restaurantDB').collection('add');
     const purchaseCollection = client.db('restaurantDB').collection('purchase');

     app.get('/add', async(req, res) =>{
        const cursor = restaurantCollection.find();
        const result = await cursor.toArray();
        res.send(result);
     })

     app.get('/purchase', async(req, res) =>{
      const cursor = purchaseCollection.find();
      const result = await cursor.toArray();
      res.send(result);
   })

     app.get('/myAdd/:email', async(req, res) =>{
      console.log(req.params.email)
      const result = await restaurantCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })

     app.get('/myOrder/:email', async(req, res) =>{
      console.log(req.params.email)
      const result = await purchaseCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })

    app.get('/add/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await restaurantCollection.findOne(query)
      res.send(result)
    })



     app.post('/add', async(req,res)=>{
      const addFood = req.body;
      console.log(addFood)
      const result = await restaurantCollection.insertOne(addFood);
      res.send(result);
    })


     app.post('/purchase', async(req,res)=>{
      const addPurchase = req.body;
      console.log(addPurchase)
      const result = await purchaseCollection.insertOne(addPurchase);
      res.send(result);
    })

   
    app.put('/add/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedItem = req.body;
      const restaurant = {
        $set: {
             photo: updatedItem.photo,
             foodName: updatedItem.foodName,
             category: updatedItem.category,
             quantity: updatedItem.quantity,
             description: updatedItem.description,
             price: updatedItem.price,
             origin: updatedItem.origin,
        }
      }
      const result = await restaurantCollection.updateOne(filter, restaurant, options)
      res.send(result);
    })

    
    app.delete('/purchase/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await purchaseCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('restaurant is running')
})

app.listen(port, () =>{
    console.log(`restaurant is running at port: ${port}`)
})