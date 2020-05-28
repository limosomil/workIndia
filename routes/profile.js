const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.post('/edit', (req, res)=>{

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let phone = req.body.phone;
    if ( phone == undefined || phone.length!=10 || isNaN(phone))
    {
        res.json({
            status: 211,
            msg: "Invalid Phone Number."
        });
    }
    else if( first_name == undefined || last_name == undefined)
    {
        res.json({
            status: 212,
            msg: "Invalid Name."
        });
    }
    else
    {
        connection.query(`UPDATE user_data SET first_name='${first_name}', last_name='${last_name}', usr_setupdone=TRUE where phone='${phone}'`,function(error, results, fields){
            if (error) throw error;
            if(results.affectedRows > 0)
            {
                res.json({
                    status: 213,
                    msg: "User Update successful."
                
                });

            }
            else
            {
                res.json({
                    status: 214,
                    msg: "User Update unsuccessful. Kindly check phone."
                
                });
            }
        });
    }

});

router.post('/updateFCM', (req, res)=>{

    let fcm = req.body.fcm;
    let phone = req.body.phone;
    if ( phone == undefined || phone.length!=10 || isNaN(phone))
    {
        res.json({
            status: 221,
            msg: "Invalid Phone Number."
        });
    }
    else if( fcm == undefined || isNaN(fcm) )
    {
        res.json({
            status: 222,
            msg: "Invalid Token."
        });
    }
    else
    {
        connection.query(`UPDATE user_data SET fcm_token='${fcm}' where phone='${phone}'`,function(error, results, fields){
            if (error) throw error;
            if(results.affectedRows > 0)
            {
                res.json({
                    status: 223,
                    msg: "FCM Update successful."
                
                });

            }
            else
            {
                res.json({
                    status: 224,
                    msg: "FCM Update unsuccessful. Kindly check phone."
                
                });
            }
        });
    }
    
    
    //Just recieve FCM token and phone number in req variable.
    //Validate it.
    //Update in database.

});



router.post('/updateLoginToken' );

router.post('/get', (req, res)=>{

    let phone = req.body.phone;

    console.log(!isNaN(phone));

    if(phone == undefined || phone.length != 10 || isNaN(phone)){
        //If the post data does not contain the phone number.
        res.json({
            status: 201,
            msg: "Invalid Data."
        });

    }else{
        connection.query(`SELECT * FROM user_data WHERE phone='${phone}'`, function(error, results, fields){

            if(error) throw error;

            if(results.length > 0){

                res.json({
                    status: 202,
                    msg: "User fetch successful.",
                    user: results[0]
                });

            }else{
                res.json({
                    status: 203,
                    msg: "User Not Found"
                });
            }

        });
    }
});

module.exports = router;