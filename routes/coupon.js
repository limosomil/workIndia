const express = require('express');
const util = require('util');
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
                
                let coupon_id = results.insertId;
                
                connection.query(`INSERT INTO log_coupon (coupon_id, coupon_code, amount, log_type, phone, user_id, date, coupon_type) VALUES ('${coupon_id}', '${coupon_code}', '${amount}', 'Add', '0000000000', null, '${moment().format('YYYY-MM-DD HH:mm:ss')}', 'g')`, function(error, results, fields){

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

router.post('/redeem', async (req, res, next)=>{
    //Endpoint to redeem a coupon.

    const query = util.promisify(connection.query).bind(connection);

    const phone = req.body.phone;
    const couponcode = req.body.couponcode;
    let amount = 0;

    try{
        
        //Find coupon and phone pair.
        let search = await query(`SELECT * FROM couponcode WHERE code=? AND (phone='0000000000' OR phone=?)`, [couponcode, phone]);
        
        if(search.length == 0){
            // Coupon and phone pair not found.
            res.status(200).json({
                status: 303,
                msg: "Coupon Invalid/Not Found."
            });

            return;
        }

        amount = search[0].amount;
        const couponid = search[0].id;
        let couponcount = search[0].count;

        const expiry_date = moment(search[0].expiry_date);
        let current_date = moment();

        if(expiry_date.isBefore(current_date)){
            res.status(200).json({
                status: 302,
                msg: "Coupon Is Expired."
            });

            return;
        }

        let ctype = 'p';

        if(search[0].phone=='0000000000'){
            ctype = 'g';
            //If it is a general Coupon, check if it is already used.
            let couponlog = await query(`SELECT * FROM log_coupon WHERE phone=? AND coupon_code=? AND coupon_type='g'`, [phone, couponcode]);

            if(couponlog.length > 0){
                //console.log("Coupon is already used.");
                res.status(200).json({
                    status: 304,
                    msg: "Coupon already redeemed."
                });

                return;
            }
        }

        //Coupon is valid. Redeem it.

        //Get the wallet.
        let wallet = await query(`SELECT * FROM wallet WHERE id = (SELECT id FROM user_data WHERE phone=?)`, [phone]);
        let balance = wallet[0].balance;
        let coupon_amt = wallet[0].coupon_amount;
        const walletid = wallet[0].id;

        balance += amount;
        coupon_amt += amount;

        let updateWallet = await query(`UPDATE wallet SET balance=?, coupon_amount=? WHERE id=?`, [balance, coupon_amt, walletid]);
        let updatelogCoupon = await query(`INSERT INTO log_coupon (coupon_id, coupon_code, amount, log_type, phone, user_id, date, coupon_type) VALUES (?,?,?,?,?,?,?,?)`,
         [couponid, couponcode, amount, 'redeem', phone, walletid, moment().format('YYYY-MM-DD HH:mm:ss'), ctype]);

        if(couponcount > 1){
            //Reduce Coupon Count
            couponcount--;
            let updateCoupon = await query(`UPDATE couponcode SET count=? WHERE id=?`, [couponcount, couponid]);
        }else{
            //Delete Coupon
            let updateCoupon = await query(`DELETE FROM couponcode WHERE id=?`, [couponid]);
        }

        res.json({
            status: 305,
            msg: "Coupon Redeemed."
        });

        return;


    }catch(e){

        console.trace(e);
        
        res.json({
            status: 301,
            msg: "Internal Server Error."
        });

        return;

    }

});

module.exports = router;