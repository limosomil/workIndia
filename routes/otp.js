const express = require('express');
const router = express.Router();
const pool = require('../connectionPool');

const moment = require('moment');
const jwt = require('jsonwebtoken');

router.post('/generate', async(req, res)=>{

    try{

        phone = req.body.phone;

        if(phone == undefined || phone.length != 10 || isNaN(phone)){
            //If the post data does not contain the phone number.
            res.json({
                status: 101,
                msg: "Invalid Data."
            });
            return;
        }

        const otpDb = await pool.query(`SELECT * FROM otp_data WHERE phone=?`, [phone]);

        if(otpDb.length > 0){

            //TODO: Check if already requested OTP is expired.

            let OTPdate = moment(otpDb[0].date_created);
            let current_time = moment();
            let minutes_old = (current_time-OTPdate)/60000;

            if(minutes_old > 10){

                const deleteExpired = await pool.query(`DELETE FROM otp_data WHERE id=?`, [otpDb[0].id]);

            }else{
                res.json(
                    {
                        status: 102,
                        msg: 'OTP is already requested.'
                    }
                );
                return;
            }
        }

        // Generate new OTP and add it to otp_data table with current timestamp
        let otp = Math.floor(100000 + Math.random() * 900000);
        let current_time = moment().format('YYYY-MM-DD HH:mm:ss'); //current timestamp formatted for mysql

        const insertOtp = await pool.query(`INSERT INTO otp_data (otp, phone, date_created) VALUES (?, ?, ?)`, [otp, phone, current_time]);

        res.json({
            status: 103,
            msg: `OTP for ${req.body.phone} created.`,
            otp: otp //FIXME: Remove this after testing
        });

    }catch(e){
        console.log(e);
        res.json({
            status: 106,
            msg: "Internal Server Error."
        });
    }

});

function generateLogin_Token(userdata){
    return new Promise(async (resolve, reject)=>{

        try{
            const loginTokenText = `${userdata.phone}+${moment().valueOf()}`;

            let updateLoginTokenInDB = await pool.query(`UPDATE user_data SET login_token=? WHERE id=?`, [loginTokenText, userdata.id]);

            jwt.sign({userID: userdata.id, phone: userdata.phone, login_token:loginTokenText}, "mysecret", (err, token)=>{
                if(err) throw err;
                
                userdata.login_token = token;

                resolve(userdata);
            });
        }catch(e){

            reject(e);

        }

    });
}

router.post('/verify', async (req, res)=>{

    let phone = req.body.phone;
    let otp = String(req.body.otp);

    try{

        if(otp==undefined || isNaN(otp) || phone == undefined || isNaN(phone) || phone.length!=10){

            res.json(
                {
                    //Invalid Post Data.
                    status: 111,
                    msg: 'Invalid Data'
                }
            );
    
            return;
    
        }
    
        let findOtp = await pool.query(`SELECT * FROM otp_data WHERE otp=? AND phone=?`, [otp, phone]);

        if( ! findOtp.length > 0)
        {
            //OTP not found.
            res.json({
                status: 112,
                msg: 'Invalid OTP'
            });
            return;
        }

        OTPdate = moment(findOtp[0].date_created);
        current_time = moment();
        minutes_old = (current_time-OTPdate)/60000;

        if(minutes_old > 10)
        {
            //If OTP is expired, this will be executed.

            //Delete expired OTP from the database.

            const deleteExpired = await pool.query(`DELETE FROM otp_data WHERE id=?`, [findOtp[0].id]);

            res.json(
                {
                    status: 113,
                    msg: "Otp is expired."
                }
            );

            return;

        }

        var userdata;
        let userResult = await pool.query(`SELECT * FROM user_data WHERE phone=?`, [phone]);

        let statusCode = 115;

        if(userResult.length == 0){
            //new user

            let newUser = await pool.query(`INSERT INTO user_data (phone, date_registered, usr_setupdone, type) VALUES (?, ?, FALSE, 1)`, [phone, current_time.format('YYYY-MM-DD hh:mm:ss')]);

            let idInserted = newUser.insertId;

            //Initialize wallet.
            let initWallet = await pool.query(`INSERT INTO wallet (id) VALUES (?)`, [idInserted]);

            //Fetch userDetails
            let fetchNewUser = await pool.query(`SELECT * FROM user_data WHERE id=?`,[idInserted]);

            userdata = fetchNewUser[0];

            statusCode = 114;

        }else{

            //old user

            userdata = userResult[0];

        }

        //Get Login Token
        userdata = await generateLogin_Token(userdata);

        delete_otpentry(res, otp, phone, userdata, statusCode, "Login Successful.");

        return;

    }catch(e){

        console.log(e);
        res.json({
            status: 116,
            msg: "Internal Server Error."
        });

    }

});

async function delete_otpentry(res, otp, phone, userdata, status, msg){
    //Since OTP is verified, delete it from the otp_data table.
    let del = await pool.query(`DELETE FROM otp_data WHERE otp=? AND phone=?`, [otp, phone]);
        
    res.json({
        status: status,
        msg: msg,
        user: userdata
    });
}

module.exports = router;