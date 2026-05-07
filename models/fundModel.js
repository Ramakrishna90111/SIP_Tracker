const db = require("../utility/dbManager");
function addFund(data){
    return new Promise((resolve,reject)=>{
        db.run(
            `INSERT INTO mutual_fund(
                fund_id,
                fund_name,
                amc_name,
                fund_type,
                category,
                nav_value,
                nav_date,
                risk_level
            )
            VALUES(?,?,?,?,?,?,?,?)
            `,
            [
                data.fund_id,
                data.fund_name,
                data.amc_name,
                data.fund_type,
                data.category,
                data.nav_value,
                data.nav_date,
                data.risk_level
            ],
            function(err){
                if(err){
                    reject(err);
                }
                else{
                    resolve("Fund Added");
                }

            }
        );

    });
}
function fetchFunds(){
    return new Promise((resolve,reject)=>{
        db.all(
            `SELECT * FROM mutual_fund`,
            [],
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
function updateNAV(fundId,nav){
    return new Promise((resolve,reject)=>{
        db.run(
            `
            UPDATE mutual_fund
            SET nav_value = ?
            WHERE fund_id = ?
            `,
            [nav,fundId],
            function(err){
                if(err){
                    reject(err);
                }
                else{
                    resolve("NAV Updated");
                }
            }
        );

    });
}
module.exports = {
    addFund,
    fetchFunds,
    updateNAV
};