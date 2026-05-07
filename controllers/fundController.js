const {
    addFund,
    fetchFunds,
    updateNAV
} = require("../models/fundModel");
const createFund = async (req,res)=>{
    try{
        const response = await addFund(req.body);
        res.json(response);
    }
    catch(error){
        res.json(error);
    }

};
const getFunds = async (req,res)=>{
    const funds = await fetchFunds();
    res.json(funds);
};
const updateFundNAV = async (req,res)=>{
    const { fundId } = req.params;
    const { nav_value } = req.body;
    const response = await updateNAV(fundId,nav_value);
    res.json(response);

};
module.exports = {
    createFund,
    getFunds,
    updateFundNAV
};