let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IgpXVCJ9.eyJ1c2VySUQiOjExLCJwaG9uZSI6Ijk3ODc4Nzg3ODciLCJsb2dpbl90b2tlbiI6Ijk3ODc4Nzg3ODcrMTU5MTM0NjQ5MjE1NyIsImlhdCI6MTU5MTM0NjQ5Mn0.Ehx241MzaomOxitf-jNhj8_4Ofeol4pV3DQMWhtBCi0";
const jwt = require('jsonwebtoken');

jwt.verify(token, 'mysecret', (err, user)=>{

    if (err) throw err;

    console.log(user);

});