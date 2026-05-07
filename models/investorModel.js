const db = require("../utility/dbManager");
const users = [
    {
        email:"admin@gmail.com",
        password:"12345",
        role:"investor",
        loggedIn:false
    }
];
const invalidTokens = [];
function getInvestorFromDB(investorId){
    return new Promise((resolve,reject)=>{
        db.get(
            `SELECT * FROM investor WHERE investor_id = ?`,
            [investorId],
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
function getHoldingsFromDB(investorId){
    return new Promise((resolve,reject)=>{
        const query = `
        SELECT mf.fund_name,
            SUM(it.units_allocated) as units_held,mf.nav_value,
            SUM(it.units_allocated * mf.nav_value) as current_value
        FROM investment_transaction it
        JOIN mutual_fund mf
        ON it.fund_id = mf.fund_id
        WHERE it.investor_id = ?
        AND it.transaction_status = 'Success'
        GROUP BY mf.fund_name`;
        db.all(query,[investorId],(err,rows)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}
function getNetworthFromDB(investorId){
    return new Promise((resolve,reject)=>{
        const query = `
        SELECT
            SUM(it.units_allocated * mf.nav_value) as networth
        FROM investment_transaction it
        JOIN mutual_fund mf
        ON it.fund_id = mf.fund_id
        WHERE it.investor_id = ?
        AND it.transaction_status = 'Success'
        `;
        db.get(query,[investorId],(err,row)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(row);
            }
        });

    });
}
const loginUser = (email,password)=>{
    const userIndex = users.findIndex(
        (u)=>u.email == email && u.password == password
    );
    if(userIndex != -1){
        users[userIndex] = {
            ...users[userIndex],
            loggedIn:true
        };
        return users[userIndex];
    }
    return null;

};
const logoutUser = (email,token)=>{
    const userIndex = users.findIndex(
        (u)=>u.email == email && u.loggedIn == true
    );
    if(userIndex != -1){
        users[userIndex] = {
            ...users[userIndex],
            loggedIn:false
        };
        invalidTokens.push(token);
        return true;
    }
    return false;

};
async function fetchInvestor(investorId){
    try{
        const investor = await getInvestorFromDB(investorId);
        return investor;
    }
    catch(error){
        return undefined;
    }

}
async function calculateHoldings(investorId){
    try{
        const holdings = await getHoldingsFromDB(investorId);
        return holdings;
    }
    catch(error){
        return undefined;
    }
}
async function calculateNetworth(investorId){
    try{
        const networth = await getNetworthFromDB(investorId);
        return networth;
    }
    catch(error){
        return undefined;
    }

}
module.exports = {
    fetchInvestor,
    calculateHoldings,
    calculateNetworth,
    loginUser,
    logoutUser,
    invalidTokens
};