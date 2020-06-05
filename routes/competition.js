const express = require('express');
const router = express.Router();
// const connection = require('../connection');
const pool = require('../connectionPool');
const moment = require('moment');

const type1 = require('./competitionFiles/type1');
const type2 = require('./competitionFiles/type2');

router.use('/type1', type1);
router.use('/type2', type2);

function checkUndefined( value )
{
    if ( value == undefined || isNaN(value))
    {
        return true;
    }
    else
        return false;

}

router.post('/create', async (req, res)=>{
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
        "shortamunt":"100000"
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
    let shortamount = req.body.shortamount;
    try
    {
        if ( checkUndefined(type) || checkUndefined(entry_fee) || checkUndefined(cashvalue) || checkUndefined(max_entry) )
        {
            res.json({
                status: 401,
                msg: "Invalid/Missing fields."
            
            });
            return;
        }
        else if ( checkUndefined(entries_count) || checkUndefined(duration_day) || last_day == undefined || start_date == undefined)
        {
            res.json({
                status: 404,
                msg: "Invalid/Missing fields."
            
            });
            return;
        }
        else if( type == 2 && checkUndefined(shortamount))
        {
            res.json({
                status: 403,
                msg: "Invalid/Missing Short Amount."
            
            });
            return;
        }
        else
        {
            let last = moment( last_day , 'DD-MM-YYYY HH:mm:ss');
            last = last.format('YYYY-MM-DD HH:mm:ss');
    
            let start = moment(start_date, 'DD-MM-YYYY'); // TODO: Make the default start time to 9:15 or whatever the BSE timing is.
            start = start.format('YYYY-MM-DD HH:mm:ss');
            const results = await pool.query(`INSERT INTO competitions (type, entry_fee, cashvalue, max_entry, entries_count, duration_day, day_added, start_date, last_day)  VALUES (?,?,?,?,?,?,?,?,?)`,[type, entry_fee,cashvalue,max_entry,entries_count,duration_day,current_time,start,last]);
            let id = results.insertId;
            if( type == 2)
            {
                const sht = await pool.query(`INSERT into shortamount (id, shortamount) VALUES (?,?)`,[id, shortamount]);
            }
            res.json({
                status: 402,
                msg: `Competition created.`
            });
            return;
            
        }
    }
    catch(e){
        console.log(e);
        res.json({
            status: 431,
            msg: "Internal Server Error."
        });
    }

});

router.get('/getAllCompetitions',async (req, res)=>{

    
    try
    {
        const results = await pool.query(`SELECT * FROM competitions`,[]);
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
        return;

    }
    catch(e){
        console.log(e);
        res.json({
            status: 431,
            msg: "Internal Server Error."
        });
    }
    
   

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
            return;
         }

        //TODO: A check for not allowing to open a expired competition.

        let update = await pool.query(`UPDATE competitions SET status=? WHERE id=?`, [status, competitionID]);

        
        res.json({
            status: 423,
            msg: "Status updated successfully."
        });
        return;

    }catch( e ){
        
        res.json({
            status: 422,
            msg: "Internal Server Error."
        });
        return;
    }

});

module.exports = router;