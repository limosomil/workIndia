const express = require('express');
const router = express.Router();
const connection = require('../connection');
const moment = require('moment');

router.post('/create', (req, res)=>{
    // create a new competition by admin
    /* Sample Input
    {
        "type":"1",
        "entry_fee":100, 
        "cashvalue":100000, 
        "max_entry":10, 
        "entries_count":0, 
        "duration_day":2,
        "last_day":"31-05-2020 23:00:20"
    }
    */
    let type = req.body.type;
    let entry_fee = req.body.entry_fee;
    let cashvalue = req.body.cashvalue;
    let max_entry = req.body.max_entry;
    let entries_count = req.body.entries_count;
    let duration_day = req.body.duration_day;
    let current_time = moment().format('YYYY-MM-DD HH:mm:ss');
    let last_day = req.body.last_day;

    if ( checkUndefined(type) || checkUndefined(entry_fee) || checkUndefined(cashvalue) || checkUndefined(max_entry) )
    {
        res.json({
            status: 401,
            msg: "Invalid/Missing fields."
        
        });
    }
    else if ( checkUndefined(entries_count) || checkUndefined(duration_day) || last_day == undefined )
    {
        res.json({
            status: 401,
            msg: "Invalid/Missing fields."
        
        });
    }
    else
    {
        let last = moment( last_day , 'DD-MM-YYYY HH:mm:ss' );
        last = last.format('YYYY-MM-DD HH:mm:ss');
        connection.query(`INSERT INTO competitions (type, entry_fee, cashvalue, max_entry, entries_count, duration_day, day_added, last_day)  VALUES ('${type}', '${entry_fee}', '${cashvalue}','${max_entry}', '${entries_count}', '${duration_day}', '${current_time}', '${last}')`, function (error, results, fields) {
            if (error) throw error;
            res.json({
                status: 402,
                msg: `Competition created.`,
            });
        });
    }




});

router.get('/getAllCompetitions', (req, res)=>{
    connection.query(`SELECT * FROM competitions`, function (error, results, fields) {
        if (error) throw error;
        //console.log(results);
        var objs = [];
        for (var i = 0;i < results.length; i++) {
            objs.push({id: results[i].id,
                    type: results[i].type,
                    entry_cost: results[i].entry_fee,
                    virtual_cash: results[i].cashvalue,
                    max_entries: results[i].max_entry,
                    duraton: results[i].duration_day,
                    last_day: moment(results[i].last_day).format('YYYY-MM-DD HH:mm:ss')

                });
        }
        res.json({
            status: 402,
            count: `${results.length}`,
            competitions : objs
        });
    });

});


router.get('/enterCompetition', (req, res)=>{

//Validate Data
//Get current prices
//Deduct Amount
//


});



function checkUndefined( value )
{
    if ( value == undefined || isNaN(value))
    {
        return true;
    }
    else
        return false;

}

module.exports = router;