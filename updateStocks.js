const superagent = require('superagent');
var moment = require('moment');
const connection = require('./connection');

const cron = require('node-cron');

cron.schedule("*/5 9-23 * * 1-5", function(){
  console.log("Entered at " + moment());
  superagent
  .get('https://us-central1-fcmtrial-dac95.cloudfunctions.net/app/getLive')
//   .set('accept', 'json')
  .end((err, res) => {
    // Calling the end function will send the request
    // console.log(err);
    // console.log(res.body);
    table = res.body.Table;
    // console.log(table[0].COMPNAME);

    var compnanyNames = "";

    var valueList = "";

    // let c = 0;
    for(key in table){
        stockobj = table[key];
        var scripdate = moment((stockobj.Date.replace('/','-')), "MM/DD/YYYY hh:mm:ss a");
        var currentDate = moment();
        var scriptdate_db = scripdate.format('YYYY-MM-DD hh:mm:ss');
        var prev_date = moment((stockobj.PREV_DATE.replace('/','-')), "MM/DD/YYYY hh:mm:ss a").format('YYYY-MM-DD hh:mm:ss');;

        
        
        daysdiff = ((currentDate - scripdate)/86400000);
        if(daysdiff<30){
            // compnanyNames = compnanyNames + "\n" + table[key].COMPNAME;
            // console.log(table[key].COMPNAME);
            valueList = valueList + `('${stockobj.STK_EXCHANGE}', '${stockobj.SCRIPCODE}', '${stockobj.FINCODE}', '${stockobj.SYMBOL}', '${stockobj.COMPNAME}', '${stockobj.S_NAME}', '${stockobj.SCRIP_GROUP}', '${scriptdate_db}', ${parseFloat(stockobj.OPEN_PRICE)}, ${parseFloat(stockobj.HIGH_PRICE)}, ${parseFloat(stockobj.LOW_PRICE)}, ${parseFloat(stockobj.CLOSE_PRICE)}, ${parseFloat(stockobj.PREVCLOSE)}, '${prev_date}', ${parseFloat(stockobj.PERCHG)} , ${parseFloat(stockobj.NETCHG)}),`;
              
            // valueList = `('${stockobj.STK_EXCHANGE}', '${stockobj.SCRIPCODE}', '${stockobj.FINCODE}', '${stockobj.SYMBOL}', '${stockobj.COMPNAME}', '${stockobj.S_NAME}', '${stockobj.SCRIP_GROUP}', '${scriptdate_db}', ${parseFloat(stockobj.OPEN_PRICE)}, ${parseFloat(stockobj.HIGH_PRICE)}, ${parseFloat(stockobj.LOW_PRICE)}, ${parseFloat(stockobj.CLOSE_PRICE)}, ${parseFloat(stockobj.PREVCLOSE)}, '${prev_date}', ${parseFloat(stockobj.PERCHG)} , ${parseFloat(stockobj.NETCHG)})`;
            // console.log(stockobj.S_NAME);
            // c++;

            // connection.query(`INSERT INTO stocks (STK_EXCHANGE, SCRIPCODE, FINCODE, SYMBOL, COMPNAME,S_NAME, SCRIP_GROUP, Date, OPEN_PRICE,HIGH_PRICE,LOW_PRICE,CLOSE_PRICE,PREVCLOSE,PREV_DATE,PERCHG,NETCHG) VALUES ${valueList}`, function(error, results, fields){
            //   if(error) throw error;
            //   console.log("Added to DB!" + key);
            // });
        }
    }

    valueList = valueList.slice(0, -1);
    // console.log(valueList);
    connection.query('TRUNCATE TABLE stocks', function(error, results, fields){
      if(error) throw error;
      console.log("Table Truncated!");
      connection.query(`INSERT INTO stocks (STK_EXCHANGE, SCRIPCODE, FINCODE, SYMBOL, COMPNAME,S_NAME, SCRIP_GROUP, Date, OPEN_PRICE,HIGH_PRICE,LOW_PRICE,CLOSE_PRICE,PREVCLOSE,PREV_DATE,PERCHG,NETCHG) VALUES ${valueList}`, function(error, results, fields){
        if(error) throw error;
        console.log("Added to DB!");
        // connection.end();
      });
    });
    

    // const fs = require('fs');

    // fs.appendFileSync('compNames.txt', compnanyNames);

  });
});

// superagent
//   .get('https://us-central1-fcmtrial-dac95.cloudfunctions.net/app/getLive')
// //   .set('accept', 'json')
//   .end((err, res) => {
//     // Calling the end function will send the request
//     // console.log(err);
//     // console.log(res.body);
//     table = res.body.Table;
//     // console.log(table[0].COMPNAME);

//     var compnanyNames = "";

//     var valueList = "";

//     // let c = 0;
//     for(key in table){
//         stockobj = table[key];
//         var scripdate = moment((stockobj.Date.replace('/','-')), "MM/DD/YYYY hh:mm:ss");
//         var currentDate = moment();
//         var scriptdate_db = scripdate.format('YYYY-MM-DD hh:mm:ss');
//         var prev_date = moment((stockobj.PREV_DATE.replace('/','-')), "MM/DD/YYYY hh:mm:ss").format('YYYY-MM-DD hh:mm:ss');;

        
        
//         daysdiff = ((currentDate - scripdate)/86400000);
//         if(daysdiff<30){
//             // compnanyNames = compnanyNames + "\n" + table[key].COMPNAME;
//             // console.log(table[key].COMPNAME);
//             valueList = valueList + `('${stockobj.STK_EXCHANGE}', '${stockobj.SCRIPCODE}', '${stockobj.FINCODE}', '${stockobj.SYMBOL}', '${stockobj.COMPNAME}', '${stockobj.S_NAME}', '${stockobj.SCRIP_GROUP}', '${scriptdate_db}', ${parseFloat(stockobj.OPEN_PRICE)}, ${parseFloat(stockobj.HIGH_PRICE)}, ${parseFloat(stockobj.LOW_PRICE)}, ${parseFloat(stockobj.CLOSE_PRICE)}, ${parseFloat(stockobj.PREVCLOSE)}, '${prev_date}', ${parseFloat(stockobj.PERCHG)} , ${parseFloat(stockobj.NETCHG)}),`;
              
//             // valueList = `('${stockobj.STK_EXCHANGE}', '${stockobj.SCRIPCODE}', '${stockobj.FINCODE}', '${stockobj.SYMBOL}', '${stockobj.COMPNAME}', '${stockobj.S_NAME}', '${stockobj.SCRIP_GROUP}', '${scriptdate_db}', ${parseFloat(stockobj.OPEN_PRICE)}, ${parseFloat(stockobj.HIGH_PRICE)}, ${parseFloat(stockobj.LOW_PRICE)}, ${parseFloat(stockobj.CLOSE_PRICE)}, ${parseFloat(stockobj.PREVCLOSE)}, '${prev_date}', ${parseFloat(stockobj.PERCHG)} , ${parseFloat(stockobj.NETCHG)})`;
//             // console.log(stockobj.S_NAME);
//             // c++;

//             // connection.query(`INSERT INTO stocks (STK_EXCHANGE, SCRIPCODE, FINCODE, SYMBOL, COMPNAME,S_NAME, SCRIP_GROUP, Date, OPEN_PRICE,HIGH_PRICE,LOW_PRICE,CLOSE_PRICE,PREVCLOSE,PREV_DATE,PERCHG,NETCHG) VALUES ${valueList}`, function(error, results, fields){
//             //   if(error) throw error;
//             //   console.log("Added to DB!" + key);
//             // });
//         }
//     }

//     valueList = valueList.slice(0, -1);
//     // console.log(valueList);
//     connection.query('TRUNCATE TABLE stocks', function(error, results, fields){
//       if(error) throw error;
//       console.log("Table Truncated!");
//       connection.query(`INSERT INTO stocks (STK_EXCHANGE, SCRIPCODE, FINCODE, SYMBOL, COMPNAME,S_NAME, SCRIP_GROUP, Date, OPEN_PRICE,HIGH_PRICE,LOW_PRICE,CLOSE_PRICE,PREVCLOSE,PREV_DATE,PERCHG,NETCHG) VALUES ${valueList}`, function(error, results, fields){
//         if(error) throw error;
//         console.log("Added to DB!");
//         // connection.end();
//       });
//     });
    

//     // const fs = require('fs');

//     // fs.appendFileSync('compNames.txt', compnanyNames);

//   });



    // STK_EXCHANGE, SCRIPCODE, FINCODE, SYMBOL, COMPNAME,S_NAME, SCRIP_GROUP, Date, OPEN_PRICE,HIGH_PRICE,LOW_PRICE,CLOSE_PRICE,PREVCLOSE,PREV_DATE,PERCHG,NETCHG
//     Volume: "2.72",
//     value: "0.03"
//     };

//     // 
//     var scripdate = moment().subtract(30, 'days');
//     console.log(scripdate);
//     var currentDate = moment();
//     console.log(currentDate);

//     console.log((currentDate - scripdate)/86400000);

//CRON JOB : */5 9-14 * * 1-5
