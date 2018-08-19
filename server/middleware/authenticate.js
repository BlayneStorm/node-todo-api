var {User} = require("./../models/user.js");

var authenticate = (req, res, next) => {
    var token = req.header("x-auth"); //get the token
    
    User.findByToken(token).then((user) => {
        if (!user) { //valid token but there's no document that matches it in db
            return Promise.reject("No docs match the params specified in user.js");
        }
        
        //res.send(user); 
        
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send({textResponse: err});
    });
};

module.exports = {
    authenticate: authenticate
};