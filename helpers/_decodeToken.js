let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjksInBob25lIjoiOTc1NzA2Mjc0NyIsImxvZ2luX3Rva2VuIjoiOTc1NzA2Mjc0NysxNTkxMzAxODQyMTIzIiwiaWF0IjoxNTkxMzAxODQyfQ.zPeozfJgXHbPAaLpDOJK3MdMbQ1KZuYLf6mpyHhnY7k";

const jwt = require('jsonwebtoken');

jwt.verify(token, 'mysecret', (err, user)=>{

    if (err) throw err;

    console.log(user);

});