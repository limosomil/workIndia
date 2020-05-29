const express = require('express');
const router = express.Router();
const connection = require('../connection');

const moment = require('moment');

router.post('/redeem', (req, res)=>{
    //Endpoint to redeem a coupon.

    phone = req.body.phone;
    couponcode = req.body.couponcode;

    if(phone == undefined && couponcode == undefined && phone.length != 10){
        //invalid data.

        res.json({
            status : "301",
            msg: "Invalid Data."
        });
    }else{

        //check if coupon & phone pair exists.
        connection.query(`SELECT * FROM couponcode WHERE phone='${phone}' AND code='${couponcode}'`, function(error, results, fields){

            if(error) throw error;

            if(results.length > 0){
                //Coupon and phone pair found

                //Expiry validation here.
                let coupon_expiry = moment(results[0].expiry_date);
                let currentTime = moment();

                if(currentTime.isAfter(coupon_expiry)){

                    connection.query(`DELETE FROM couponcode WHERE id=${results[0].id}`);

                    res.json({
                        status: 306,
                        msg: "Coupon Expired."
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

                            count--;
                            if(count==0){
                                connection.query(`DELETE FROM couponcode WHERE phone=${phone}`, function(error, resp, fields){
                                    res.json({
                                        status: 304,
                                        msg: "Coupon Redeemed."
                                    });
                                });
                            }
                            else{
                                connection.query(`UPDATE couponcode SET count=${count} WHERE phone=${phone}`, function(error, resp, fields){
                                    res.json({
                                        status: 305,
                                        msg: "Coupon Redeemed."
                                    });
                                });
                            }
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