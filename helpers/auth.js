const jwt = require('jsonwebtoken');

function authorizePhone(req, res, next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token==null) return res.json({
        status: 000,
        msg: "Token Missing"
    });

    jwt.verify(token, 'mysecret', (err, user)=>{

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
        next();
    });
}

function authorizeID(req, res, next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token==null) return res.json({
        status: 000,
        msg: "Token Missing"
    });

    jwt.verify(token, 'mysecret', (err, user)=>{

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
        next();
    });
}

module.exports = {authorizeID, authorizePhone};