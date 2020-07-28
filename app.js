const express = require('express');
const bodyparser = require('body-parser');
const connection = require('./connection');
var cors = require('cors');
var multer = require('multer');
var upload = multer();

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));
// app.use(multer);
// app.use(upload.array());
// app.use(express.static('public'));


const login = require('./routes/login');
const sites = require('./routes/sites');

app.get('/', (req,res)=>{
    res.send("If you are here, you probably shouldn't be on this server. Shoo away. Or I'll call 911.");
});


app.use('/app/user', login);
app.use('/app/sites',sites);
// app.get('/', (req,res) => res.send('Welcome To Stock Game Internal API!'));

const port = 3000;
app.listen(port, ()=> console.log(`Example app listening at http://localhost:${port}`));