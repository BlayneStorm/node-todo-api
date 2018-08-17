//load in ObjectId off of the mongodb native driver
const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");

var id = "5b75e904958d36bc623d8043"; //id in todos

if (!ObjectID.isValid(id)) {
    console.log("ID not valid");
}

//Todo.find({
//    _id: id //mongoose converts it automatically to an ObjectID
//}).then((todos) => {
//    console.log("Todos", todos);
//}); //returns empty array if id doesn't exist
//
//Todo.findOne({
//    _id: id
//}).then((todo) => {
//    console.log("Todo", todo);
//}); //returns null if id doesn't exist
    
Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log("Id not found");
    }
    console.log("Todo By Id", todo);
}).catch((err) => {
    console.log(err);
}); //returns null if id doesn't exist

User.findById("5b75a39d190396d8099b1687").then((user) => {
    if (!user) {
        return console.log("Id not found");
    }
    console.log("User By Id", user);
}, (err) => {
    console.log(err);
});

//mongoose doesn't require to pass in ObjectID (like mongodb .find) in queries
//doesn't exist = is valid (same number of chars) bur is not in database