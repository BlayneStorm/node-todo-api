var mongoose = require("mongoose");

mongoose.Promise = global.Promise; //we set up mongoose to use promises instead of callbacks
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose: mongoose
};