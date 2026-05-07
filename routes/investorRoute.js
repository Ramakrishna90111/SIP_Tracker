const express = require('express');
const {
    login,
    logout,
    getInvestor,
    investorHoldings,
    investorNetworth
} = require('../controllers/investorController');
const { invalidTokens } = require('../models/investorModel');
const { verifyJWT } = require('../utility/authManager');
const router = express.Router();
router.get("/:investorId",
(req,res,next)=>{
    const token = req.headers.authorization;
    try{
        if(invalidTokens.find((t)=>t==token)){
            return res.send("Token expired");
        }
        const payload = verifyJWT(token);
        if(payload.role=="investor"){
            next();
        }
    }
    catch(error){
        res.json("Invalid token");
    }
},
getInvestor
);
router.get("/holdings/:investorId",investorHoldings);
router.get("/networth/:investorId",investorNetworth);
router.post("/login",login);
router.post("/logout",logout);
module.exports = router;