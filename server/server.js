var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose.js");
var {Todo} = require("./models/todo.js");
var {User} = require("./models/user.js");

var app = express();

app.use(bodyParser.json()); //3rd party middlewear - access smth off of the library (not custom - which will be a function arg (req, res, next) -> {...}) - with this in place we can now send JSON to our express application

//POST route - lets us create new todos (resource creation)
app.post("/todos", (req, res) => {
    var todo = new Todo({
        text: req.body.text //the data we send is an object with a property text
    });
    
    //console.log(req.body);
    
    todo.save().then((doc) => { //won't save todos that don't respect validators
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

//GET route - returning all the todos
app.get("/todos", (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos: todos}); //send back an object instead of just the array so it can be useful in the future if we want to add custom status codes and others
    }, (err) => {
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {
    app: app
};

//__v property is version (keep tracks of various model changes over time) - comes from mongoose
//body-parser lets us send JSON to the server so it can use it (turns the string body into a JS object) (take the JSON and converts it to an object)