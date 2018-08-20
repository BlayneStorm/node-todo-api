const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");
const {User} = require("./../models/user.js");
const {todos, users, populateTodos, populateUsers} = require("./seed/seed.js");

//insertMany (mongoose method) - takes an array (like the one above) and inserts all of the documents into the collection
//beforeEach lets us run some code before every single test case, moves on to test cases only after we call done()
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe("PATCH /todos/:id", () => {
    it("should update the todo", (done) => {
        var hexId = todos[0]._id.toHexString();
        
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text: "Text changed (test 1)", 
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("Text changed (test 1)");
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA("number");
            })
            .end(done);
    });
    
    it("should clear completedAt when todo is not completed", (done) => {
        var hexId = todos[1]._id.toHexString();
        
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text: "Text changed (test 2)", 
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("Text changed (test 2)");
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    
    it("should return a 401 if not authenticated", (done) => {
        var expectedRes = "Authentication required  (provide valid unmodified token)";
        var expectedRes2 = "No docs match the params specified in user.js";
        
        request(app)
            .get("/users/me")
            .set("x-auth", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Yjc5OWQ4NDRmNWU0MjQ4NTg1ODlkNmQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTM0Njk2ODM2fQ.9IahI49z2QwnNnMHE1L62IYDhv1iMGFjbVz6WV1iGlY")
            .expect(401)
            .expect((res) => {
                expect(res.body.textResponse).toBe(expectedRes2);
                //expect(res.body).toEqual({}); //if nothing comes back
            })
            .end(done);                
    });
});

describe("POST /users", () => {
    it("should create a user", (done) => {
        var email = "example@example.com";
        var password = "123baby";
        
        request(app)
            .post("/users")
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
            
                User.findOne({email: email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password); //because it's hashed
                    done();
                }).catch((err) => {
                    done(err);
                });;
            });
    }); //pass in valid data (email + password)
    
    it("should return validation errors if request invalid", (done) => {
        request(app)
            .post("/users")
            .send({
                email: "invalid_email",
                password: "pass"
            })
            .expect(400)
            .end(done);
    }); //invalid email or password that's not 6 characters
    
    it("should not create user if email in use", (done) => {
        request(app)
            .post("/users")
            .send({
                email: users[0].email,
                password: "passy"
            })
            .expect(400)
            .end(done);
    });
});

describe("POST /users/login", () => {
    it("should login user and return auth token", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();  
                expect(res.body.email).toBe("email_2@yahoo.com");
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
            
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: "auth",
                        token: res.headers["x-auth"]
                    });
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
    
    it("should reject invalid login", (done) => {
        var expectedRes = "No user exists with that email";
        var expectedRes2 = "Password and hashed password are not matches";
        
        request(app)
            .post("/users/login")
            .send({
                email: "non_existent_email@yahoo.com",
                password: "any_password"
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers["x-auth"]).toNotExist();  
                expect(res.body.textResponse).toBe(expectedRes);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
            
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});