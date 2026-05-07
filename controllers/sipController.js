const {
    createSIP,
    getSIP,
    processSIP,
    getTransactions
} = require("../models/sipModel");
const registerSIP = async (req,res)=>{
    const response = await createSIP(req.body);
    res.json(response);
};
const fetchSIP = async (req,res)=>{
    const { sipId } = req.params;
    const sip = await getSIP(sipId);
    res.json(sip);
};
const processSIPInstallment = async (req,res)=>{
    const response = await processSIP(req.body);
    res.json(response);
};
const transactionHistory = async (req,res)=>{
    const { sipId } = req.params;
    const transactions = await getTransactions(sipId);
    res.json(transactions);
};
module.exports = {
    registerSIP,
    fetchSIP,
    processSIPInstallment,
    transactionHistory
};