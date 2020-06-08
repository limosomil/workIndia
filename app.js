const express = require('express');
const bodyparser = require('body-parser');
const connection = require('./connection');

const app = express();
app.use(bodyparser.json());


const otp = require('./routes/otp');
const profile = require('./routes/profile');
const coupon = require('./routes/coupon');
const competition = require('./routes/competition');

const authCheck = require('./routes/authcheck');

app.get('/', (req,res)=>{
    res.send("If you are here, you probably shouldn't be on this server. Shoo away. Or I'll call 911.");
});

app.use('/authCheck', authCheck);

app.use('/otp', otp);
app.use('/profile', profile);
app.use('/coupon', coupon);
app.use('/competition', competition);
// app.get('/', (req,res) => res.send('Welcome To Stock Game Internal API!'));

const port = 3000;
app.listen(port, ()=> console.log(`Example app listening at http://localhost:${port}`));