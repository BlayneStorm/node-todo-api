var mongoose = require("mongoose");

mongoose.Promise = global.Promise; //we set up mongoose to use promises instead of callbacks
mongoose.connect("mongodb://BlayneStorm:Password98@ds225442.mlab.com:25442/node-todo-api-db" || "mongodb://localhost:27017/TodoApp");

module.exports = {
    mongoose: mongoose
};