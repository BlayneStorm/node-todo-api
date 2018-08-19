const {SHA256} = require("crypto-js");

const jwt = require("jsonwebtoken");

//jwt.sign - takes the object (the data with user id), it creates the hash and it returns the token value
var data = {
    id: 10
}; 

var token = jwt.sign(data, "123abc");

console.log(token);

//jwt.verify - takes the token and the secret and verifies it (makes sure the data wasn't manipulated)
var decoded = jwt.verify(token, "123abc");

console.log("Decoded:", decoded);

//var message = {x: "I am user number 3"};
//var hash = SHA256(message); //object
//
//console.log(hash);
//console.log(hash.toString());
//console.log(JSON.stringify(hash));
//
//var x = {a:1, b:2, c: "pizza"};
//console.log(x);
//console.log(x.toString());
//console.log(JSON.stringify(x));
//
//var data = {
//    id: 4
//};
//
//var token = {
//    data: data,
//    hash: SHA256(JSON.stringify(data) + "somesecret").toString()
//}; //this is what we want to send back to the client
//
//token.data.id = 5;
//token.hash = SHA256(JSON.stringify(token.data)).toString();
//
//var resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString(); //in db
//
//if (resultHash === token.hash) { 
//    console.log("Data was not changed / manipulated");
//} else {
//    console.log("Data was changed / manipulated");
//}

//256 - number of bits that are the resulting hash