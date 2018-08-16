const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");

const todos = [{
    text: "First test todo"
}, {
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
            .send({text: text}) //send data along with the request as the body, the object arg is gonna be converted into JSON by supertest automatically
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