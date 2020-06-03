const jwt = require('jsonwebtoken');

const token = jwt.sign({userID: 2, phone: "7666066985"}, "mysecret");

console.log(token);