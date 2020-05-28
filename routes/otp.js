const express = require('express');
const router = express.Router();
const connection = require('../connection');

var moment = require('moment');

router.post('/generate', (req,res)=>{

    phone = req.body.phone;
    if(phone == undefined || phone.length != 10 || isNaN(phone)){
        //If the post data does not contain the phone number.
        res.json({
            status: 101,
            msg: "Invalid Data."
        });

    }else{

        //Check if otp is already requested in otp_data table
        connection.query(`SELECT * FROM otp_data WHERE phone='${req.body.phone}'`, function (error, results, fields) {
            if (error) throw error;

            if(results.length > 0){

                //OTP is already requestied.

                res.json(
                    {
                        status: 102,
                        msg: 'OTP is already requested.'
                    }
                );
            }else{
                // Generate new OTP and add it to otp_data table with current timestamp
                let otp = Math.floor(100000 + Math.random() * 900000);
                let current_time = moment().format('YYYY-MM-DD HH:mm:ss'); //current timestamp formatted for mysql
                connection.query(`INSERT INTO otp_data (otp, phone, date_created) VALUES ('${otp}', '${req.body.phone}', '${current_time}')`, function (error, results, fields) {
                    if (error) throw error;

                    res.json({
                        status: 103,
                        msg: `OTP for ${req.body.phone} created.`,
                        otp: otp //FIXME: Remove this after texting
                    });
                });
            }
        });
    }
});



router.post(
    '/verify',
    (req, res) => {
        let phone = req.body.phone;
        let otp = String(req.body.otp);


        if(otp != undefined && phone !=undefined && otp.length == 6 && phone.length == 10 && !isNaN(otp) && !isNaN(phone)){
            connection.query(`SELECT * FROM otp_data WHERE otp='${parseInt(otp)}' AND phone='${phone}'`, function(error, results, fields){
                if(error) throw error;
                
                if(results.length == 1){

                    OTPdate = moment(results[0].date_created);
                    current_time = moment();
                    minutes_old = (current_time-OTPdate)/60000;

                    // console.log(`Current Time : ${current_time}\nOTP Date : ${OTPdate}\nMinutesOld : ${minutes_old}`);

                    if(minutes_old > 10)
                    {
                        //If OTP is expired, this will be executed.

                        //TODO: Delete expired OTP from the database.
                        res.json(
                            {
                                status: 113,
                                msg: "Otp is expired."
                            }
                        );

                    }else{
                        //Check if new user, or old user login.
                        var userdata;
                        connection.query(`SELECT * FROM user_data WHERE phone='${phone}'`, function(error, results, fields){
                            if (error) throw error;

                            if(results.length > 0){
                                //OLD USER.
                                userdata = results[0];

                                delete_otpentry(res, otp, phone, userdata, 115, "Login Successful.");
                            }else{
                                //NEW USER.
                                connection.query(`INSERT INTO user_data (phone, date_registered, usr_setupdone, type) VALUES ('${phone}', '${current_time.format('YYYY-MM-DD hh:mm:ss')}', FALSE, 1)`, function(error, results, fields){
                                    if(error) throw error;

                                    idInserted = results.insertId;

                                    //Initialize wallet.
                                    connection.query(`INSERT INTO wallet (id) VALUES (${idInserted})`, function(error, results, fields){

                                        if(error) throw error;
                                    
                                        //fetch user data to send a json response.
                                        connection.query(`SELECT * FROM user_data WHERE id=${idInserted}`, function(error, results, fields){
                                            if(error) throw error;
    
                                            userdata = results[0];
    
                                            delete_otpentry(res, otp, phone, userdata, 114, "New User Created.");
                                        });

                                    });
                                });
                            }
                        
                        });
                    }

                }else{
                    // OTP and Phone Number Pair does not match in the database.
                    res.json({
                        status: 112,
                        msg: 'Invalid OTP'
                    });
                }
            });
        }else{
            res.json(
                {
                    //Invalid Post Data.
                    status: 111,
                    msg: 'Invalid Data'
                }
            );
        }
    }
);

function delete_otpentry(res, otp, phone, userdata, status, msg){
    //Since OTP is verified, delete it from the otp_data table.
    connection.query(`DELETE FROM otp_data WHERE otp='${parseInt(otp)}' AND phone='${phone}'`, function(error, results, fields){
        if(error) throw error;

        res.json({
            status: status,
            msg: msg,
            user: userdata
        });
    });
}

module.exports = router;