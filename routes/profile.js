const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.post('/edit', (req, res)=>{

    //Get all the user data in request variable.
    //validate data.
    //Update everything except phone. (phone cannot be changed).
    //Set usr_setupdone to true.

});

router.post('/updateFCM', (req, res)=>{

    //Just recieve FCM token and phone number in req variable.
    //Validate it.
    //Update in database.

});



// router.post('/updateLoginToken' );

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