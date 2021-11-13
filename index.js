const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require('body-parser');
const { restart } = require('nodemon');

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfs8l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true });


client.connect((err) => {
    const destinationCollection = client.db("travelWorld").collection("destination");
    const bookingCollection = client.db("travelWorld").collection("bookings");

    // add place

    app.post("/addPlace", async (req, res)=> {
        const result = await destinationCollection.insertOne(req.body)
        res.send(result);
    });

    app.get("/allPlaces", async (req, res) => {
        const result = await destinationCollection.find({}).toArray();
        res.send(result)
    })

    // get single place 
    app.get("/singlePlace/:id", async (req, res) => {
        const result = await destinationCollection
        .find({_id: ObjectId(req.params.id)})
        .toArray();
        res.send(result[0]);
    });


    // confirm Order
    app.post("/confirmBooking", async (req, res) => {
        const result = await bookingCollection.insertOne(req.body)
        res.send(result);
    });


    // My Order
    app.get("/myBookings/:email", async (req, res) => {
        const result = await bookingCollection.find({ email: req.params.email}).toArray();
        res.send(result);
    });


    // Cancel Order 
    app.delete("/cancelOrder/:id", async (req, res) => {
        const result = await bookingCollection.deleteOne({_id: ObjectId(req.params.id)
        });
        res.send(result);
    })

    // All Bookings

    app.get("/allBooking", async (req, res) => {
        const result = await bookingCollection.find({}).toArray()
        res.send(result);
    })

    // update Status 
    app.put("/updateStatus/:id", (req, res) => {
        const id = req.params.id;
        const updatedStatus = req.body.status;
        const filter = {_id: ObjectId(id)};
         bookingCollection.updateOne(filter, {
            $set: {status: updatedStatus},
        })
        .then(result => {
            res.send(result);
        })
        
    })

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen( port, () => {
    console.log("Running Winter Server on port", port);
});