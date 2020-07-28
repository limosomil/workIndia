const express = require('express');
const router = express.Router();
const pool = require('../connectionPool');
const moment = require('moment');

router.post('/', async (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;

    try {

        if( username == undefined)
        {
            res.json({
                
                msg: "Username Missing"
            });
            return;
        }
        if( password == undefined)
        {
            res.json({
                
                msg: "Password Missing"
            });
            return;
        }

        const checkUserName = await pool.query(`SELECT * from user_details where username=?`,[username]);
        if(checkUserName.length>0)
        {
            res.json({
                
                msg: "Username Already Exists"
            });
            return;
        }


        const insert = await pool.query(`INSERT INTO user_details (username, password) VALUES (?, ?)`, [username, password]);
        let idInserted = insert.insertId;
        res.json({
            
            status: `Account created.`
        });
        return;
        
    } catch(e){

        console.log(e);
        res.json({
           
            msg: "Internal Server Error."
        });

    }

    

});

router.post('/auth', async (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;

    try {

        if( username == undefined)
        {
            res.json({
               
                msg: "Username Missing"
            });
            return;
        }
        if( password == undefined)
        {
            res.json({
                
                msg: "Password Missing"
            });
            return;
        }

        const checkCreds = await pool.query(`SELECT * from user_details where username=? and password=?`,[username,password]);
        if(checkCreds.length>0)
        {
            res.json({
                status: "Success",
                userId: checkCreds[0].id
            });
            return;
        }
        else
        {
            res.json({
                status: "Credentials Invalid/Don't match",
                
            });
            return;
        }


        
        
    } catch(e){

        console.log(e);
        res.json({
            msg: "Internal Server Error."
        });

    }

    

});


module.exports = router;