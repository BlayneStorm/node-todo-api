const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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

//determines what exactly gets sent back when a mongoose model is converted into a JSON value (things like password, tokens should not be sent back to the user) - overwrite
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject(); //takes the mongoose variable 'user' and converts it into a regular object where only the properties available on the document exist
    
    return _.pick(userObject, ["_id", "email"]);
};

//UserSchema.methods is an object (on which we can add any method we like - instance methods) - instance methods have acces to individual document which is what we need to create the JWT
UserSchema.methods.generateAuthToken = function() {
    var user = this; //instance methods get called with individual document
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

//model method (not instance) - .statics (not .methods)
UserSchema.statics.findByToken = function(token) {
    var User = this; //model methods get called with the model as the 'this' binding
    var decoded;
    
    try {
        decoded = jwt.verify(token, "abc123"); //throws an error if token value was manipulated or the secret doesn't match the secret with which it was created
    } catch(err) {
        return new Promise((resolve, reject) => {
            reject("Authentication required  (provide valid unmodified token)"); 
        }); //alternate syntax: return Promise.reject(); - this triggers .catch() in authenticate.js
    }
    
    //success case - if we're able to succesfully decode the token passed in the header
    return User.findOne({
        _id: decoded._id,
        "tokens.token": token, //query nested document
        "tokens.access": "auth"       
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    
    return User.findOne({email: email}).then((user) => {
        if (!user) {
            return Promise.reject("No user exists with that email"); //this triggers .catch() in server.js
        }
        
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res === true) {
                    resolve(user);
                } else {
                    reject("Password and hashed password are not matches");
                }
            });
        });
    });
};

//mongoose middleware - run code before a given event ('save' a doc in our case)
UserSchema.pre("save", function(next) {
    var user = this; //access the individual document
               
    if (user.isModified("password") === true) {   
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash; //hash the new password
                next();
            });
        });  
    } else {
        next();
    }
});

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