const express = require('express');
const router = express.Router();
const connection = require('../connection');

const moment = require('moment');

router.post('/addCoupon', (req, res)=>{

    /*
        Sample Request :
        {
            "couponcode": "get500",
            "amount": 500,
            "expiry_date": "02-12-2021",
            "count": 100
        }
    */

    let coupon_code = req.body.couponcode;
    let amount = req.body.amount;
    let expiry = req.body.expiry_date;
    let count = req.body.count;

    if(coupon_code == undefined || amount == undefined || isNaN(amount) || expiry == undefined || count == undefined || isNaN(count))
    {
        res.json({
            status: 313,
            msg: "Invalid Data."
        });

    }else{

        let currentTime = moment();
        let expiry_date = moment(expiry, 'DD-MM-YYYY HH:mm:ss');

        if(expiry_date.isBefore(currentTime)){

            //Expiry date is before current date.

            res.json({
                status: 311,
                msg: "Expiry Date is before current date."
            });

        }else{

            currentTime = currentTime.format('YYYY-MM-DD HH:mm:ss');
            expiry_date = expiry_date.format('YYYY-MM-DD HH:mm:ss');

            //General Use coupon.
            connection.query(`INSERT INTO couponcode (code, amount, phone, date_added, expiry_date, count) VALUES ('${coupon_code}', '${amount}', '0000000000', '${currentTime}', '${expiry_date}', ${count})`, function(error, results, fields){
                
                if(error) throw error;
                
                connection.query(`INSERT INTO log_coupon (type, log) VALUES ('coupon_add', '${coupon_code} : ${amount} : ${count} added. ID : ${results.insertId}')`, function(error, results, fields){

                    if(error) throw error; 

                    res.json({
                        status: 312,
                        msg: "Added."
                    });

                });

            });
        }
    }

});

router.post('/redeem', (req, res)=>{
    //Endpoint to redeem a coupon.

    //TODO: Use LOG table.

    phone = req.body.phone;
    couponcode = req.body.couponcode;

    if(phone == undefined || couponcode == undefined || phone.length != 10){
        //invalid data.

        res.json({
            status : "301",
            msg: "Invalid Data."
        });
    }else{

        //check if coupon & phone pair exists.
        connection.query(`SELECT * FROM couponcode WHERE (phone='${phone}' OR phone='0000000000') AND code='${couponcode}'`, function(error, results, fields){

            if(error) throw error;

            if(results.length > 0){
                //Coupon and phone pair found

                //Expiry validation here.
                let coupon_expiry = moment(results[0].expiry_date);
                let currentTime = moment();

                let coupon_id = results[0].id;

                if(currentTime.isAfter(coupon_expiry)){

                    connection.query(`DELETE FROM couponcode WHERE id=${coupon_id}`, function(error,results, fields){

                        if(error) throw error;

                        res.json({
                            status: 306,
                            msg: "Coupon Expired."
                        });

                    });

                }else{
                    //get count
                let count = results[0].count;
                let amount = results[0].amount;
                connection.query(`SELECT * FROM wallet WHERE id = (SELECT id FROM user_data WHERE phone='${phone}')`, function(error, r, fields){
                    if(error) throw error;
        
                    if(results.length > 0){
        
                        let balance = r[0].balance;
                        let newBalance = balance + amount;

                        let coupon_amt = r[0].coupon_amount;
                        coupon_amt = coupon_amt + amount;

                        connection.query(`UPDATE wallet SET balance=${newBalance}, coupon_amount=${coupon_amt} WHERE id=${r[0].id}`, function(error, resp, fields){
                            if(error) throw error;

                            connection.query(`INSERT INTO log_coupon (type, log) VALUES ('coupon_used', 'Wallet : ${r[0].id} amount : ${amount} Date : ${moment().format('DD/MM/YYYY HH:mm:ss')}')`, function(error, results, fields){

                                if(error) throw error;

                                count--;
                                if(count==0){
                                    connection.query(`DELETE FROM couponcode WHERE id=${coupon_id}`, function(error, resp, fields){
                                        res.json({
                                            status: 304,
                                            msg: "Coupon Redeemed."
                                        });
                                    });
                                }
                                else{
                                    connection.query(`UPDATE couponcode SET count=${count} WHERE id=${coupon_id}`, function(error, resp, fields){
                                        res.json({
                                            status: 305,
                                            msg: "Coupon Redeemed."
                                        });
                                    });
                                }
                            });
                        });
        
                    }else{
        
                        //Failed to locate the wallet.
        
                        res.json({
                            status: "302",
                            msg: "Interal Error. Please Try again."
                        });
                    }
                });
                }


                

            }else{
                //Coupon and phone pair NOT found
                res.json({
                    status: "303",
                    msg: "Invalid Coupon Code."
                });
            }
        });
    }

});

module.exports = router;