const pool = require('../connectionPool');
const moment = require('moment');

async function createDictionary(){

    return new Promise(async (resolve, reject)=>{
        // let start = moment();
        try{
            let res = await pool.query(`SELECT * FROM stocks`);
    
            let stockJson = {}
            for(var i = 0; i<res.length; i++){
        
                stockJson[res[i].SCRIPCODE] = JSON.parse(JSON.stringify(res[i]));
        
            }
            // let end = moment() - start;
            // console.log(end);
        
            // console.log(stockJson[540776].COMPNAME);
            resolve(stockJson);
        }catch(e){
            reject(e);
        }
    });
    
}

module.exports = createDictionary;