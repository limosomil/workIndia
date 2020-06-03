const express = require('express');
const router = express.Router();
const pool = require('../../connectionPool');
const moment = require('moment');
const createDictionary = require('../../helpers/stockDictionary');

function checkUndefined( value )
{
    if ( value == undefined || isNaN(value))
    {
        return true;
    }
    else
        return false;

}

router.get('/enter', async (req, res)=>{

    /*
        Competition Status :
        1 - Open.
        2 - On Going.
        3 - Closed.
        4 - Cancelled.
    */

    try{

        //Validate Data
        const playerID = req.body.playerID;
        const competitionID = req.body.competitionID;
        const stockList = req.body.stockList;
        if(checkUndefined(playerID) || checkUndefined(competitionID)){
            
            res.json({
                status: 432,
                msg: "Invalid/Missing data."
            });
            return;
        }

        //Get competition details
        const competition = await pool.query(`SELECT * FROM competitions as A LEFT JOIN  shortamount  using(id) WHERE id=?`, [competitionID]);

        //Check competition status.
        const competitionStatus = competition[0].status;
        const competitionFee = competition[0].entry_fee;
        const cashvalue = competition[0].cashvalue;
        const shortamount = competition[0].shortamount;
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
        const wallet = await pool.query(`SELECT * FROM wallet WHERE id=?`, [playerID]);

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
        const deduct = pool.query(`UPDATE wallet SET balance=?, money_played=? WHERE id=?`, [newBalance, moneyPlayed, playerID]);

        //get player username
        const username = (await pool.query(`SELECT username FROM user_data WHERE id=?`, [playerID]))[0].username;

        //Update Entries table.
        const date_added = moment().format('YYYY-MM-DD HH:mm:ss');
        const entryInsert = await pool.query(`INSERT into comp_entries (comp_id, player_id, username, balance, date_added, date_edited) VALUES (?,?,?,?,?,?)`, [competitionID, playerID, username, cashvalue, date_added, date_added]);
        const entryID = entryInsert.insertId;

        if(stockList.length>0){

            //Stock Manipulation
            const stockJson = await createDictionary();

            let totalBAmount = 0;
            let totalSAmount = 0;


            let insertString = "";
            let sqlList = [];
            /*
            type '0': Long
            type '1': Short
            */
            for(var i = 0; i<stockList.length; i++){    

                if(stockJson[stockList[i].scripcode] == undefined){
                    res.json({
                        status: 438,
                        msg: "Invalid Scrip Code recieved."
                    })

                    //TODO: ROLLBACK !

                    return;
                }

                const currentCost = stockJson[stockList[i].scripcode].CLOSE_PRICE;
                const amount = currentCost * stockList[i].qty;

                // console.log(`SCRIP : ${stockList[i].scripcode} COST : ${currentCost}`);
                if(stockList[i].type == 0)
                    totalBAmount += amount;
                else
                    totalSAmount += amount;

                insertString += `(?, ?, ?, ?, ?, ?),`;
                sqlList.push(entryID, stockList[i].scripcode, currentCost, stockList[i].qty , amount, stockList[i].type);

            }
            insertString = insertString.slice(0, -1);

            if(totalBAmount > (cashvalue+totalSAmount)){
                res.json({
                    status: 436,
                    msg: "Total Amount exceeds Balance."
                });
                return;
            }
            if(totalSAmount > shortamount){
                res.json({
                    status: 439,
                    msg: "Total Short Amount exceeds Limit."
                });
                return;
            }


            const cash = cashvalue - totalBAmount + totalSAmount;

            //FIXME: Is check required for empty stock list ?
            let addStockList = await pool.query(`INSERT INTO entry_description_bs (entry_id, scripcode, stockprice, quantity, amount, buy_or_sell) VALUES ${insertString}`, sqlList);

            //Update Balance
            let updateBalance = await pool.query(`UPDATE comp_entries SET balance=? WHERE entry_id=?`, [cash, entryID]);
        }

        //TODO: Check entry count again.

        //Update Competition entries.
        entries_count++;
        //TODO: Rollback if entry count exceeded
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

router.post('/edit', async (req, res)=>{

    try{

        const playerID = req.body.playerID; //FIXME: Not required. Only used for auth.
        const entryID = req.body.entryID;
        const stockList = req.body.stockList;

        if(checkUndefined(playerID) || checkUndefined(entryID)){
                
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
        const competition = await pool.query(`SELECT * FROM competitions as A LEFT JOIN  shortamount  using(id) WHERE id=?`, [competitionID]);

        //Check competition status.
        const competitionStatus = competition[0].status;
        const cashvalue = competition[0].cashvalue;
        const shortamount = competition[0].shortamount;
        
        if(competitionStatus != 1){

            res.json({
                status: 513,
                msg: "Competition is closed. Entried Cannot be edited now."
            });
            return;
        }


        
        let totalBAmount = 0;
        let totalSAmount = 0;

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
                if(stockList[i].type == 0)
                    totalBAmount += amount;
                else
                    totalSAmount += amount;

                insertString += `(?, ?, ?, ?, ?,?),`;
                sqlList.push(entryID, stockList[i].scripcode, currentCost, stockList[i].qty , amount, stockList[i].type);

            }
            insertString = insertString.slice(0, -1);

            if(totalBAmount > (cashvalue+totalSAmount)){
                res.json({
                    status: 436,
                    msg: "Total Amount exceeds Balance."
                });
                return;
            }
            if(totalSAmount > shortamount){
                res.json({
                    status: 439,
                    msg: "Total Short Amount exceeds Limit."
                });
                return;
            }


            cash = cashvalue - totalBAmount + totalSAmount;


            //DELETE ALL THE STOCK DESCRIPTION ENTRIES
            const deleteStockDesc = await pool.query(`DELETE FROM entry_description_bs WHERE entry_id=?`, [entryID]);

            //ADD NEW ENTRIES 
            let addStockList = await pool.query(`INSERT INTO entry_description_bs (entry_id, scripcode, stockprice, quantity, amount, buy_or_sell) VALUES ${insertString}`, sqlList);

        }else{
            //DELETE ALL THE STOCK DESCRIPTION ENTRIES
            const deleteStockDesc = await pool.query(`DELETE FROM entry_description_bs WHERE entry_id=?`, [entryID]);
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

//TODO: Change status codes in type1/type2

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