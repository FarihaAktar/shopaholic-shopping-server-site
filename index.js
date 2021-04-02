const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const port = 5055

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssth5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World fariha!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const productCollection = client.db("shopaholic").collection("products");
  const orderProductCollection = client.db("shopaholic").collection("order");

  app.get('/products', (req, res) => {
    productCollection.find()
      .toArray((err, products) => {
        res.send(products)
      })
  });
  app.get('/manageProduct', (req, res) => {
    productCollection.find()
      .toArray((err, products) => {
        res.send(products)
      })
  });

  app.get('/product/:key', (req, res) => {
    productCollection.find({ _id: ObjectId(req.params.key) })
      .toArray((err, product) => {
        res.send(product)
      })
  })

  app.get('/orders', (req, res) => {
    orderProductCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    // console.log(req.params.id)
    // console.log("delete this", id)
    // orderProductCollection.findOneAndDelete({ _id: id })
    //   .then(documents => res.send(!!documents.value))
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('new product added', newProduct);
    productCollection.insertOne(newProduct)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })

  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log('new product added', order);
    orderProductCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })


  // client.close();

});


app.listen(process.env.PORT || port)