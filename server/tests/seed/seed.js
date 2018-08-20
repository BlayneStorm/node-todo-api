const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo} = require("./../../models/todo.js");
const {User} = require("./../../models/user.js");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: "email_1@yahoo.com",
    password: "userOnePass",
    tokens: [{
        access: "auth",
        token: jwt.sign({_id: userOneId, access: "auth"}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: "email_2@yahoo.com",
    password: "userTwoPass",
    tokens: [{
        access: "auth",
        token: jwt.sign({_id: userTwoId, access: "auth"}, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos); //return allows us to chain callbacks
    }).then(() => {
        done();
    });
};

//we need to call .save() to run the middleware in user.js and not .insertMany()
const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        
        //wait for both of them to succeed
        return Promise.all([userOne, userTwo]);
    }).then(() => { //this callback won't get fired untill all of the promises get resolved (until userOne + userTwo get saved to the db);
        done();
    });
}

module.exports = {
    todos: todos,
    users: users,
    populateTodos,
    populateUsers
};