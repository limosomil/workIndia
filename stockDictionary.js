const pool = require('./connectionPool');
const moment = require('moment');

(async()=>{
    let start = moment();
    let res = await pool.query(`SELECT * FROM stocks`);

    let stockJson = {}
    for(var i = 0; i<res.length; i++){

        stockJson[res[i].SCRIPCODE] = JSON.parse(JSON.stringify(res[i]));

    }
    let end = moment() - start;
    console.log(end);

    console.log(stockJson[540776].COMPNAME);
})();