const jwt = require('jsonwebtoken');
const pool = require('../connectionPool');

function checkLoginToken(userID, loginToken){
    return new Promise(async (resolve, reject)=>{
        //check Auth Token Here.
        try{
            let checkToken = await pool.query(`SELECT * FROM user_data WHERE id=? AND login_token=?`, [userID, loginToken]);

            if(checkToken.length > 0){
                resolve(true);
            }else{
                reject("Login Token does not match.");
            }

        }catch(e){
            reject(e);
        }
    });
}

function authorizePhone(req, res, next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token==null) return res.json({
        status: 000,
        msg: "Token Missing"
    });

    jwt.verify(token, 'mysecret', async (err, user)=>{

        if(err){
            // console.log(err);
            res.json({
                status: 001,
                msg: "Invalid Token."
            });
            return;
        }

        if(req.body.phone == undefined || req.body.phone.length != 10 || isNaN(req.body.phone) || req.body.phone!=user.phone){

            res.json({
                status: 002,
                msg: "User not authenticated."
            });
            return;

        }

        req.userID = user.userID;
        req.phone = user.phone;
        let token = user.login_token;

        //Check login token in db.

        try{

            let checkToken = await checkLoginToken(user.userID, token);
            if(checkToken){
                next();
            }

        }catch(e){
            // console.log(e);
            res.json({
                status: 003,
                msg: "User auth failed."
            });
            return;
        }
    });
}

function authorizeID(req, res, next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token==null) return res.json({
        status: 000,
        msg: "Token Missing"
    });

    jwt.verify(token, 'mysecret', async (err, user)=>{

        if(err){
            // console.log(err);
            res.json({
                status: 001,
                msg: "Invalid Token."
            });
            return;
        }

        if(req.body.playerID == undefined || isNaN(req.body.phone) || req.body.playerID!=user.userID){

            res.json({
                status: 002,
                msg: "User not authenticated."
            });
            return;

        }

        req.userID = user.userID;
        req.phone = user.phone;
        let token = user.login_token;
        //Check login token in db.

        try{

            let checkToken = await checkLoginToken(user.userID, token);
            if(checkToken){
                next();
            }

        }catch(e){
            res.json({
                status: 003,
                msg: "User auth failed."
            });
            return;
        }
    });
}

module.exports = {authorizeID, authorizePhone};