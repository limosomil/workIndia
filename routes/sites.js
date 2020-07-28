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
        for (var i = 0;i < results.length; i++) {


        }


        
        
    } catch(e){

        console.log(e);
        res.json({
            error_status: 500,
            msg: "Internal Server Error."
        });

    }

    

});

router.post(':user', async (req, res)=>{
    let userid = req.params.user;
    let username = req.body.username;
    let password = req.body.password;
    let website = req.body.website;


    try {

        if( userid == undefined || username == undefined || password == undefined || website == undefined)
        {
            res.json({
                msg: "Fields Missing"
            });
            return;
        }

        const insert = await pool.query(`INSERT INTO saved_passwords (website, username, password) VALUES (?, ?, ?)`, [website, username, password]);
        
        res.json({
            status: "success"

        });

        
        
    } catch(e){

        console.log(e);
        res.json({
            msg: "Internal Server Error."
        });

    }

    

});

module.exports = router;