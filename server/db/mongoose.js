var mongoose = require("mongoose");

mongoose.Promise = global.Promise; //we set up mongoose to use promises instead of callbacks
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp");

module.exports = {
    mongoose: mongoose
};