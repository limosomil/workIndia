const express = require('express');
const router = express.Router();
const pool = require('../../connectionPool');
const moment = require('moment');
const createDictionary = require('../../helpers/stockDictionary');
const {authorizePhone, authorizeID} = require('../../helpers/auth');

function checkUndefined( value )
{
    if ( value == undefined || isNaN(value))
    {
        return true;
    }
    else
        return false;

}

router.get('/enter', authorizeID, async (req, res)=>{

    /*
        Competition Status :
        1 - Open.
        2 - On Going.
        3 - Closed.
        4 - Cancelled.
    */

    try{

        //Validate Data
        const userID = req.body.userID;
        const competitionID = req.body.competitionID;
        const stockList = req.body.stockList;
        if(checkUndefined(userID) || checkUndefined(competitionID)){
            
            res.json({
                status: 432,
                msg: "Invalid/Missing data."
            });
            return;
        }

        //Get competition details
        const competition = await pool.query(`SELECT * FROM competitions WHERE id=?`, [competitionID]);

        //Check competition status.
        const competitionStatus = competition[0].status;
        const competitionFee = competition[0].entry_fee;
        const cashvalue = competition[0].cashvalue;
        let entries_count = competition[0].entries_count;
        
        if(competitionStatus != 1){
            

            res.json({
                status: 433,
                msg: "Competition is not open for entries."
            });
            return;
        }

        if(competition[0].max_entry == entries_count){
            res.json({
                status: 434,
                msg: "Competition is full."
            });
            return;
        }

        //Check if wallet has enough balance.
        const wallet = await pool.query(`SELECT * FROM wallet WHERE id=?`, [userID]);

        if(wallet[0].balance < competitionFee){
            
            res.json({
                status: 435,
                msg: "Not enough Balance."
            });
            return;
        }

        let newBalance = wallet[0].balance - competitionFee;
        let moneyPlayed = wallet[0].money_played + competitionFee;

        //Deduct from wallet, add to money_played
        const deduct = pool.query(`UPDATE wallet SET balance=?, money_played=? WHERE id=?`, [newBalance, moneyPlayed, userID]);

        //get player username
        const username = (await pool.query(`SELECT username FROM user_data WHERE id=?`, [userID]))[0].username;

        //Update Entries table.
        const date_added = moment().format('YYYY-MM-DD HH:mm:ss');
        const entryInsert = await pool.query(`INSERT into comp_entries (comp_id, player_id, username, balance, date_added, date_edited) VALUES (?,?,?,?,?,?)`, [competitionID, userID, username, cashvalue, date_added, date_added]);
        const entryID = entryInsert.insertId;

        if(stockList.length>0){

            //Stock Manipulation
            const stockJson = await createDictionary();

            let totalAmount = 0;

            let insertString = "";
            let sqlList = [];

            for(var i = 0; i<stockList.length; i++){    

                if(stockJson[stockList[i].scripcode] == undefined){
                    res.json({
                        status: "438",
                        msg: "Invalid Scrip Code recieved."
                    })

                    //TODO: ROLLBACK !

                    return;
                }

                const currentCost = stockJson[stockList[i].scripcode].CLOSE_PRICE;
                const amount = currentCost * stockList[i].qty;

                // console.log(`SCRIP : ${stockList[i].scripcode} COST : ${currentCost}`);
                totalAmount += amount;

                insertString += `(?, ?, ?, ?, ?),`;
                sqlList.push(entryID, stockList[i].scripcode, currentCost, stockList[i].qty , amount);

            }
            insertString = insertString.slice(0, -1);

            if(totalAmount > cashvalue){
                res.json({
                    status: 436,
                    msg: "Total Amount exceeds Balance."
                });
                return;
            }

            const cash = cashvalue - totalAmount;

            //FIXME: Is check required for empty stock list ?
            let addStockList = await pool.query(`INSERT INTO entry_description (entry_id, scripcode, stockprice, quantity, amount) VALUES ${insertString}`, sqlList);

            //Update Balance
            let updateBalance = await pool.query(`UPDATE comp_entries SET balance=? WHERE entry_id=?`, [cash, entryID]);
        }

        //TODO: Check entry count again.

        //Update Competition entries.
        entries_count++;
        let updateCompetition = await pool.query(`UPDATE competitions SET entries_count=entries_count+1 WHERE id=? and entries_count< max_entry `, [entries_count,competitionID]);
        res.json({
            status: 437,
            msg: "Entry Added."
        });


    }catch(e){
        console.log(e);
        res.json({
            status: 431,
            msg: "Internal Server Error."
        });
    }

});

router.post('/edit',authorizeID, async (req, res)=>{

    try{

        const userID = req.body.userID; //FIXME: Not required. Only used for auth.
        const entryID = req.body.entryID;
        const stockList = req.body.stockList;

        if(checkUndefined(userID) || checkUndefined(entryID)){
                
            res.json({
                status: 511,
                msg: "Invalid/Missing data."
            });
            return;
        }

        //Check if entry exists.
        const entry = await pool.query(`SELECT * FROM comp_entries WHERE entry_id=?`, [entryID]);

        if(!entry.length > 0){
            //Entry not found.

            res.json({
                status: 512,
                msg: "Entry not found."
            });
            return;

        }

        const competitionID = entry[0].comp_id;

        //Get competition details
        const competition = await pool.query(`SELECT * FROM competitions WHERE id=?`, [competitionID]);

        //Check competition status.
        const competitionStatus = competition[0].status;
        const cashvalue = competition[0].cashvalue;
        
        if(competitionStatus != 1){

            res.json({
                status: 513,
                msg: "Competition is closed. Entried Cannot be edited now."
            });
            return;
        }


        let totalAmount = 0;
        let cash = cashvalue;
        
        if(stockList.length>0)
        {
            //Stock Manipulation
            const stockJson = await createDictionary();

            let insertString = "";
            let sqlList = [];

            for(var i = 0; i<stockList.length; i++){    

                if(stockJson[stockList[i].scripcode] == undefined){
                    res.json({
                        status: 514,
                        msg: "Invalid Scrip Code recieved."
                    })

                    //TODO: ROLLBACK !

                    return;
                }

                const currentCost = stockJson[stockList[i].scripcode].CLOSE_PRICE;
                const amount = currentCost * stockList[i].qty;

                // console.log(`SCRIP : ${stockList[i].scripcode} COST : ${currentCost}`);
                totalAmount += amount;

                insertString += `(?, ?, ?, ?, ?),`;
                sqlList.push(entryID, stockList[i].scripcode, currentCost, stockList[i].qty , amount);

            }
            insertString = insertString.slice(0, -1);

            if(totalAmount > cashvalue){
                res.json({
                    status: 515,
                    msg: "Total Amount exceeds Balance."
                });
                return;
            }

            cash = cash - totalAmount;


            //DELETE ALL THE STOCK DESCRIPTION ENTRIES
            const deleteStockDesc = await pool.query(`DELETE FROM entry_description WHERE entry_id=?`, [entryID]);

            //ADD NEW ENTRIES 
            let addStockList = await pool.query(`INSERT INTO entry_description (entry_id, scripcode, stockprice, quantity, amount) VALUES ${insertString}`, sqlList);

        }else{
            //DELETE ALL THE STOCK DESCRIPTION ENTRIES
            const deleteStockDesc = await pool.query(`DELETE FROM entry_description WHERE entry_id=?`, [entryID]);
        }
        
        let now = moment().format('YYYY-MM-DD HH:mm:ss');
        const updateEntry = await pool.query(`UPDATE comp_entries SET balance=?, date_edited=? WHERE entry_id=?`, [cash, now, entryID]);

        res.json({
            status: 516,
            msg: "Stock Selection Updated."
        });
    }catch(e){
        console.log(e);
        res.json({
            status: 517,
            msg: "Internal Server Error"
        });
    }
});



module.exports = router;

/*
Title of invention
Prior App
Present App
Object of present invention
advantages
illustration, diagram.
Claims
*/