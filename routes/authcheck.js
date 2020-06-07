const express = require('express');
const router = express.Router();
const pool = require('../connectionPool');

const moment = require('moment');
const jwt = require('jsonwebtoken');

router.post('/', async (req,res)=>{

    try{

        const userID = req.body.userID;
        const username = req.body.username;
        const phone = req.body.phone;
        const login_token = req.body.login_token;
        const usr_setupdone = req.body.usr_setupdone;

        if( userID == undefined || isNaN(userID) || (username==undefined && usr_setupdone==1) || phone==undefined || login_token==undefined || isNaN(phone) || phone.length!=10 ){

            //Invalid Data. Log out.
            res.json({
                status: 990,
                msg: "Incomplete Data sent. Log out user."
            });

            return;

        }

        const userDb = await pool.query(`SELECT * FROM user_data WHERE id=? AND phone=?`, [userID, phone]);

        if(userDb.length != 1){

            res.json({
                status: 991,
                msg: "User Not Found. Log out user."
            });

            return;

        }

        jwt.verify(login_token, 'mysecret', async(err, user)=>{

            if(err) throw err;

            if(user.userID != userID || user.phone != phone){
                res.json({
                    status: 993,
                    msg: "Invalid Token. Logout."
                });
                return;
            }

            if(userDb[0].login_token != user.login_token){
                res.json({
                    status: 994,
                    msg: "Invalid Token. Logout."
                });
                return;
            }

            if(usr_setupdone==1 && userDb[0].username != username){

                res.json({
                    status: 995,
                    msg: "Invalid/Edited Data. Logout."
                });
                return;

            }

            res.json({
                status: 996,
                msg: "Verified."
            });
            return;

        });

    }catch(e){

        console.log(e);

        res.json({
            status: 992,
            msg: "Internal Server Error. Logout."
        });

        return;

    }

});

module.exports = router;