const express = require('express');
const router = express.Router();
const pool = require('../connectionPool');
const moment = require('moment');


router.get('/list/:userId', async (req, res)=>{
    let userid = req.params.userId;

    try {

        if( userid == undefined)
        {
            res.json({
                error_status: 001,
                msg: "Userid Missing"
            });
            return;
        }

        const checkCreds = await pool.query(`SELECT * from saved_passwords where userid=?`,[userid]);
       


        
        
    } catch(e){

        console.log(e);
        res.json({
            error_status: 500,
            msg: "Internal Server Error."
        });

    }

    

});

module.exports = router;