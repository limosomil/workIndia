const express = require('express');
const router = express.Router();
// const connection = require('../connection');
const pool = require('../connectionPool');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const {authorizePhone, authorizeID} = require('../helpers/auth');

router.post('/edit', authorizePhone, async (req, res)=>{

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let phone = req.body.phone;
    let username = req.body.username;
    //console.log("Unique"+uniqueUserName(username));

    try
    {
        if ( phone == undefined || phone.length!=10 || isNaN(phone))
        {
            res.json({
                status: 211,
                msg: "Invalid Phone Number."
            });
            return;
        }
        if( first_name == undefined || last_name == undefined)
        {
            res.json({
                status: 212,
                msg: "Invalid Name."
            });
            return;
        }
    
        const setupcheck = await pool.query(`SELECT usr_setupdone from user_data where phone=?`,[phone]);

        if(setupcheck[0].usr_setupdone == true)
        {
            const update = await pool.query(`UPDATE user_data SET first_name=?, last_name=? where phone=?`, [first_name, last_name, phone]);
               
            if(update.affectedRows > 0)
            {
                res.json({
                    status: 213,
                    msg: "User Update successful."
                
                });
                return;

            }
            else
            {
                res.json({
                    status: 214,
                    msg: "User Update unsuccessful. Kindly check phone."
                
                });
                return;
            }
           
        }
        else
        {
            if( username == undefined)
            {
                res.json({
                    status: 2110,
                    msg: "Username Missing."
                
                });
                return;
            }

            let validate = validateUserName(username);
            // console.log(username);
            // console.log(username == undefined);
            // console.log(isNaN(username));
            const uniquename = await pool.query(`SELECT username from user_data where username=?`,[username]);
            console.log("Count:"+uniquename.length);
            if(uniquename.length>0)
            {
                res.json({
                    status: 217,
                    msg: "UserName already taken."
                
                });
                return;
            }
            
            
            if(validate == false)
            {
                res.json({
                    status: 218,
                    msg: "Username Invalid"
                
                });
                return;
            }

            const updateProfile = await pool.query(`UPDATE user_data SET first_name=?, last_name=?, username=?, usr_setupdone=TRUE where phone=?`,[first_name, last_name, username, phone]);
            
            if(updateProfile.affectedRows > 0)
            {
                res.json({
                    status: 215,
                    msg: "New Profile Set."
                
                });
                return;

            }
            else
            {
                res.json({
                    status: 216,
                    msg: "New User Profile Not Set."
                
                });
                return;
            }   
            
        }

    }
    catch(e){
        console.log(e);
        res.json({
            status: 219,
            msg: "Internal Server Error."
        });
    }   

});

function validateUserName(uname) {
    let usernameRegex = /^[a-z0-9]+$/;
    let validUserName  = uname.match(usernameRegex);
    let ans = true;
    if(validUserName == null){
        ans = false;
    }
    console.log("validateUserName:"+ans);
    return ans;
} 



router.post('/updateFCM',authorizePhone, async (req, res)=>{

    let fcm = req.body.fcm;
    let phone = req.body.phone;
    if (phone == undefined || phone.length!=10 || isNaN(phone))
    {
        res.json({
            status: 221,
            msg: "Invalid Phone Number."
        });
        return;
    }
    if (fcm == undefined || isNaN(fcm) )
    {
        res.json({
            status: 222,
            msg: "Invalid Token."
        });
        return;
    }

    const fcmupdate = await pool.query(`UPDATE user_data SET fcm_token=? where phone=?`,[fcm,phone]);
          
    if(fcmupdate.affectedRows > 0)
    {
        res.json({
            status: 223,
            msg: "FCM Update successful."
        
        });
        return;

    }
    else
    {
        res.json({
            status: 224,
            msg: "FCM Update unsuccessful. Kindly check phone."
        
        });
        return;
    }
    
    
    

});



router.post('/updateLoginToken' );

router.post('/get',authorizePhone, async (req, res)=>{

    let phone = req.body.phone;

    //console.log(!isNaN(phone));

    if(phone == undefined || phone.length != 10 || isNaN(phone)){
        //If the post data does not contain the phone number.
        res.json({
            status: 201,
            msg: "Invalid Data."
        });
        return;

    }

    const deet = await pool.query(`SELECT * FROM user_data WHERE phone=?`,[phone]);
    
    if(deet.length > 0){

        res.json({
            status: 202,
            msg: "User fetch successful.",
            user: deet[0]
        });
        return;

    }else{
        res.json({
            status: 203,
            msg: "User Not Found"
        });
        return;
    }

    
    
});

module.exports = router;