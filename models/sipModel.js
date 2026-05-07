const db = require("../utility/dbManager");
function createSIP(data){
    return new Promise((resolve,reject)=>{
        db.run(
            `INSERT INTO sip_registration(
                sip_id,
                investor_id,
                fund_id,
                sip_amount,
                sip_date,
                frequency,
                start_date,
                sip_status
            )
            VALUES(?,?,?,?,?,?,?,?)`,
            [
                data.sip_id,
                data.investor_id,
                data.fund_id,
                data.sip_amount,
                data.sip_date,
                data.frequency,
                data.start_date,
                data.sip_status
            ],
            function(err){
                if(err){
                    reject(err);
                }
                else{
                    resolve("SIP Registered");
                }
            }
        );
    });
}
function getSIP(sipId){
    return new Promise((resolve,reject)=>{
        db.get(
            `SELECT * FROM sip_registration WHERE sip_id = ?`,
            [sipId],
            (err,row)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(row);
                }
            }
        );
    });
}
function processSIP(data){
    return new Promise((resolve,reject)=>{
        db.serialize(()=>{
            db.run("BEGIN TRANSACTION");
            db.run(`INSERT INTO investment_transaction(
                    transaction_id,
                    sip_id,
                    investor_id,
                    fund_id,
                    transaction_amount,
                    nav_used,
                    units_allocated,
                    transaction_date,
                    transaction_status
                )
                VALUES(?,?,?,?,?,?,?,?,?)`,
                [
                    data.transaction_id,
                    data.sip_id,
                    data.investor_id,
                    data.fund_id,
                    data.transaction_amount,
                    data.nav_used,
                    data.units_allocated,
                    data.transaction_date,
                    data.transaction_status
                ],
                (err)=>{
                    if(err){
                        db.run("ROLLBACK");
                        reject(err);
                    }
                    else{
                        db.run("COMMIT");
                        resolve("SIP Processed");
                    }
                }
            );
        });
    });
}
function getTransactions(sipId){
    return new Promise((resolve,reject)=>{
        db.all(
            `SELECT * FROM investment_transaction WHERE sip_id = ?`,
            [sipId],
            (err,rows)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(rows);
                }
            }
        );
    });
}
module.exports = {
    createSIP,
    getSIP,
    processSIP,
    getTransactions
};