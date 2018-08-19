const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value); //returns true or false
            },
            message: "{VALUE} is not a valid email"
        }
    }, 
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//determines what exactly gets sent back when a mongoose model is converted into a JSON value (things like password and tokens should not be sent back to the user)
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject(); //takes the mongoose variable 'user' and converts it into a regular object where only the properties available on the document exist
    
    return _.pick(userObject, ["_id", "email"]);
};

//UserSchema.methods is an object (on which we can add any method we like - instance methods) - instance methods have acces to individual document which is what we need to create the JWT
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access: access}, "abc123").toString();
    
    user.tokens = user.tokens.concat([{
        access: access,
        token: token
    }]);
    
    return user.save().then(() => {
        return token; 
    });
};

var User = mongoose.model("User", UserSchema);

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