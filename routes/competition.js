const express = require('express');
const router = express.Router();
const connection = require('../connection');
const pool = require('../connectionPool');
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
        "start_date": "30-05-2020"
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
    let start_date = req.body.start_date;
    let last_day = req.body.last_day;

    if ( checkUndefined(type) || checkUndefined(entry_fee) || checkUndefined(cashvalue) || checkUndefined(max_entry) )
    {
        res.json({
            status: 401,
            msg: "Invalid/Missing fields."
        
        });
    }
    else if ( checkUndefined(entries_count) || checkUndefined(duration_day) || last_day == undefined || start_date == undefined)
    {
        res.json({
            status: 401,
            msg: "Invalid/Missing fields."
        
        });
    }
    else
    {
        let last = moment( last_day , 'DD-MM-YYYY HH:mm:ss');
        last = last.format('YYYY-MM-DD HH:mm:ss');

        let start = moment(start_date, 'DD-MM-YYYY'); // Don't consider the time.
        start = start.format('YYYY-MM-DD HH:mm:ss');
        connection.query(`INSERT INTO competitions (type, entry_fee, cashvalue, max_entry, entries_count, duration_day, day_added, start_date, last_day)  VALUES ('${type}', '${entry_fee}', '${cashvalue}','${max_entry}', '${entries_count}', '${duration_day}', '${current_time}','${start}' ,'${last}')`, function (error, results, fields) {
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
            status: 412,
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

router.get('/editStatus', async (req,res)=>{

    try{
        let competitionID = req.body.competitionID;
        let status = req.body.status;

        if(checkUndefined(competitionID), checkUndefined(status)){

            res.json({
                status: 421,
                msg: "Invalid Data/Missing fields."
            });
            pool.releaseConnection();
            return;
         }

        //TODO: A check for not allowing to open a expired competition.

        let update = await pool.query(`UPDATE competitions SET status=? WHERE id=?`, [status, competitionID]);

        res.json({
            status: 423,
            msg: "Status updated successfully."
        });
        pool.releaseConnection();
        return;

    }catch( e ){
        res.json({
            status: 422,
            msg: "Internal Server Error."
        });
        pool.releaseConnection();
        return;
    }

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