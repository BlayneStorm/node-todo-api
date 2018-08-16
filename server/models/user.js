var mongoose = require("mongoose");

var User = mongoose.model("User", {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
});

module.exports = {
    User: User
};

//var newUser = new User({email: "asd2@yah.com"}); //make a new instance of the User model
//
//newUser.save().then((doc) => {
//    console.log(doc);
//    console.log(JSON.stringify(doc, undefined, 2));
//}, (err) => {
//   console.log("Unable to save user ", err);
//});