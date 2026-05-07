const { signJwt } = require("../utility/authManager");
const {
    loginUser,
    logoutUser,
    fetchInvestor,
    calculateHoldings,
    calculateNetworth
} = require("../models/investorModel");
const login = (req,res)=>{
    const { email,password } = req.body;
    const user = loginUser(email,password);
    if(!user){
        return res.status(401).json({
            error:"User not found"
        });
    }
    const token = signJwt({
        email:user.email,
        role:user.role
    });
    return res.json({ token });
};
const logout = (req,res)=>{
    const { email,token } = req.body;
    const logoutStatus = logoutUser(email,token);
    if(logoutStatus){
        return res.json("Logout successful");
    }
    else{
        return res.json("Logout failed");
    }

};
const getInvestor = async (req,res)=>{
    const { investorId } = req.params;
    const investor = await fetchInvestor(investorId);
    if(investor){
        return res.json(investor);
    }
    else{
        return res.status(404).json({
            error:"Investor not found"
        });
    }
};
const investorHoldings = async (req,res)=>{
    const { investorId } = req.params;
    const holdings = await calculateHoldings(investorId);
    return res.json({
        holdings
    });
};
const investorNetworth = async (req,res)=>{
    const { investorId } = req.params;
    const networth = await calculateNetworth(investorId);
    return res.json(networth);
};
module.exports = {
    login,
    logout,
    getInvestor,
    investorHoldings,
    investorNetworth
};