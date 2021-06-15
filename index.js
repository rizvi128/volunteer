const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID= require('mongodb').ObjectID
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5055;
app.use(cors());
app.use(bodyParser.json());




app.get('/', (req, res) => {
  res.send('Hello World!')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzfaw.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.connect(err => {
  console.log('connection error', err)
  const eventCollection = client.db("volunteer").collection("events");

  app.get('/events',(req, res) => {
    eventCollection.find()
    .toArray((err, items) =>{
      res.send(items)
    })

  })


  app.post('/addEvent', (req, res) => {
    const newEvent = req.body
    console.log('adding newEvent', newEvent)
    eventCollection.insertOne(newEvent)
    .then(result=>{
      console.log('insert done', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

app.delete('deleteItem/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  console.log('delete this', id);
  eventCollection.findOneAndDelete({_id: id})
  .then(documents => {
    res.send(!!document.value)
  })
})


});






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})