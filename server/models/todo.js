var mongoose = require("mongoose");

//create a model for everything we want to store, 1st arg: string model name
var Todo = mongoose.model("Todo", {
    text: { //specify the details for text atribute (validators)
        type: String,
        required: true,
        minLength: 1,
        trim: true //trims out any whitespaces in the beginning and end of the value
    },
    completed: { //specify the details for completed atribute (validators)
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
}); //2nd arg: object that defines the various properties for the Todo model

module.exports = {
    Todo: Todo
};

//var newTodo = new Todo({
//    text: "Cook dinner"
//}); //we're creating a new instance of the Todo model above
//
//newTodo.save().then((doc) => {
//    console.log("Saved todo ", doc);
//}, (err) => {
//    console.log("Unable to save todo");
//});

//var newTodo2 = new Todo({
//    text: "   NEW   ", //putting a number/boolean value here works because mongoose casts it automatically to a string
//    completed: "DSF",
//    completedAt: 25
//});
//
//newTodo2.save().then((doc) => {
//    console.log("Saved todo2 ", doc);
//}, (err) => {
//    console.log("Unable to save todo2 ", err);
//});