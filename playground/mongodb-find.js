//const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err) {
        return console.log("Unable to connect to MongoDB server");  
    }
    console.log("Connected to MongoDB server");
    
    db.collection("Todos").find({
        _id: new ObjectID("5b748dda75584ba410c64a98")
    }).toArray().then((docs) => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log("Unable to fetch todos ", err);
    }); //.find() returns a MongoDB cursor (pointer to all the documents), toArray returns a Promise so we can put .then
    
    db.collection("Todos").find().count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log("Unable to fetch todos ", err);
    }); 
    
    db.collection("Users").find({name: "Vlad3"}).toArray().then((users) => {
        console.log(JSON.stringify(users, undefined, 2));
    }, (err) => {
        console.log("Unable to fetch users ", err);
    });
    
    db.close(); //close connection to the MongoDB server
});