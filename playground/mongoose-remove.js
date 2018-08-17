const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");

//Todo.remove({}).then((result) => {
//    console.log(result);
//}); //remove all docs, arg needs to be {} (unlike .find where it can be empty)

Todo.findOneAndRemove({_id: "5b774a9ca1812d24b0b8244f"}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove("5b774a9ca1812d24b0b8244f").then((todo) => {
    console.log(todo);
});