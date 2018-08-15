//const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err) {
        return console.log("Unable to connect to MongoDB server");  
    }
    console.log("Connected to MongoDB server");

    db.collection("Todos").findOneAndUpdate({
        _id: new ObjectID("5b74a72675584ba410c65002")
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result); 
    });
    
    db.collection("Users").findOneAndUpdate({
        _id: new ObjectID("5b7486570a02bb6610f496c2")
    }, {
        $set: {
            name: "Vlad222"
        },
        $inc: {
            age: 5
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result); 
    });
    
    db.close(); //close connection to the MongoDB server
});