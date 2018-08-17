const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");

const todos = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "Second test todo"
}];

//insertMany (mongoose method) - takes an array (like the one above) and inserts all of the documents into the collection
//beforeEach lets us run some code before every single test case, moves on to test cases only after we call done()
beforeEach((done) => {
//    Todo.remove({}).then(() => {
//        done();
//    }); //this was only for POST, for GET we don't need an empty database
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos); //return allows us to chain callbacks
    }).then(() => {
        done();
    });
});

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        var text = "Test todo text";
        
        request(app)
            .post("/todos")
            .send({text: text}) //send data along with the request as the body, the object arg is gonna be converted into JSON by supertest automatically - this is the object that would be in body in postman
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err); //return - to stop the function execution
                }
            
                Todo.find({text: text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            }); //check what got stored in the MongoDB collection (instead of end(done))
    });
    
    it("should not create todo with invalid body data", (done) => {
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err); //return - to stop the function execution
                }
            
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => {
                    done(err);
                });
            }); 
    });
});

describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should return todo doc", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) //todos[0]._id is an ObjectID so it needs to be converted to a string to be passed into URL
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    
    it("should return 404 if todo not found", (done) => {
        var id = new ObjectID(); //valid ObjectID but not found in db collection
        
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.textResponse).toBe("Not found in collection");
            })
            .end(done);
    });
    
    it("should return 404 for non-object ids", (done) => {
        request(app)
            .get("/todos/123abc")
            .expect(404)
            .expect((res) => {
                expect(res.body.textResponse).toBe("Id invalid");
            })
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {
    it("should remove a todo", (done) => {
        var hexId = todos[1]._id.toHexString(); //converts form ObjectID to string
        
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
    
    it("should return 404 if todo not found", (done) => {
        var id = new ObjectID();
        
        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.textResponse).toBe("Not found in collection");
            })
            .end(done);
    });
    
    it("should return 404 if object id is invalid", (done) => {
        request(app)
            .get("/todos/123abc")
            .expect(404)
            .expect((res) => {
                expect(res.body.textResponse).toBe("Id invalid");
            })
            .end(done);
    });
});