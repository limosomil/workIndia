let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjksInBob25lIjoiOTc1NzA2Mjc0NyIsImxvZ2luX3Rva2VuIjoiOTc1NzA2Mjc0NysxNTkxMzAwMTc3MzExIiwiaWF0IjoxNTkxMzAwMTc3fQ.htToeZHXJp-qF0aRP3l56hp0pjhZX-yYtG_q2L4rKxk";

const jwt = require('jsonwebtoken');

jwt.verify(token, 'mysecret', (err, user)=>{

    if (err) throw err;

    console.log(user);

});