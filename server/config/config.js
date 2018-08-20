var env = process.env.NODE_ENV || "development"; //1st arg is set for heroku or test db

if (env === "development" || env === "test") {
    //when you require .json file it automatically parses it into JavaScript object
    var config = require("./config.json");
    var envConfig = config[env];
    
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];  
    }); //Object.keys() = an array of all keys from envConfig object
}

//if (env === "development") {
//    process.env.PORT = 3000;
//    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
//} else if (env == "test") {
//    process.env.PORT = 3000;
//    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
//}