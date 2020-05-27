const superagent = require('superagent');
var moment = require('moment');

superagent
  .get('https://us-central1-fcmtrial-dac95.cloudfunctions.net/app/getLive')
//   .set('accept', 'json')
  .end((err, res) => {
    // Calling the end function will send the request
    // console.log(err);
    table = res.body.Table;
    // console.log(table[0].COMPNAME);

    var compnanyNames = "";

    for(key in table){
        var scripdate = moment(table[key].Date.split(" ")[0].replace('/','-'), "MM/DD/YYYY");
        var currentDate = moment();

        daysdiff = ((currentDate - scripdate)/86400000);
        if(daysdiff>30){
            compnanyNames = compnanyNames + "\n" + table[key].COMPNAME;
            console.log(table[key].COMPNAME);
        }
    }

    const fs = require('fs');

    fs.appendFileSync('compNames.txt', compnanyNames);

  });

// let jsobObj = {
//     STK_EXCHANGE: "BSE",
//     SCRIPCODE: "532682",
//     FINCODE: "132682",
//     SYMBOL: "ABGSHIP",
//     COMPNAME: "ABG Shipyard Ltd.",
//     S_NAME: "ABG Shipyard",
//     SCRIP_GROUP: "Z",
//     Date: "5/15/2019 12:00:00 AM",
//     OPEN_PRICE: "1.12",
//     HIGH_PRICE: "1.12",
//     LOW_PRICE: "1.12",
//     CLOSE_PRICE: "1.12",
//     PREVCLOSE: "1.12",
//     PREV_DATE: "5/15/2019 12:00:00 AM",
//     PERCHG: "0.00",
//     NETCHG: "0.00",
//     Volume: "2.72",
//     value: "0.03"
//     };

//     // 
//     var scripdate = moment().subtract(30, 'days');
//     console.log(scripdate);
//     var currentDate = moment();
//     console.log(currentDate);

//     console.log((currentDate - scripdate)/86400000);