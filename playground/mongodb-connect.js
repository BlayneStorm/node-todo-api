//const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");

//var obj = new ObjectID();
//console.log(obj);

//object destructuring in ES6
var user = {name: "Vlad", age:20};
var {name} = user;
console.log(name);

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if(err) {
        return console.log("Unable to connect to MongoDB server");  
    }
    console.log("Connected to MongoDB server");
    
//    db.collection("Todos").insertOne({
//        text: "Smth to do",
//        completed: false
//    }, (err, result) => {
//        if(err) {
//            return console.log("Unable to insert todo", err);
//        }
//        
//        console.log(JSON.stringify(result.ops, undefined, 2));
//    });
    
//    db.collection("Users").insertOne({
//        name: "Vlad",
//        age: 20,
//        location: "Iasi"
//    }, (err, result) => {
//        if(err) {
//            return console.log("Unable to insert user", err);
//        }
//        
//        console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
//    });
    
    db.close(); //close connection to the MongoDB server
}); //1st arg: URL where the database lives, 2nd arg: callback funciton that will fire after the connection has succeeded or failed, TodoApp is the database that we're trying to connect to

//result.ops = an array that stores all of the docs that were inserted

//for MongoDB v3: arguments are (err, client) not (err, db) + at the end it's client.close() not db.close() + before db.collection("Todos") a new line needs to be inserted: const db = client.db("TodoApp") 

//.getTimestamp() is very good to use when you need to know when a doc was created