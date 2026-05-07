const express = require('express');
const {
    registerSIP,
    fetchSIP,
    processSIPInstallment,
    transactionHistory
} = require('../controllers/sipController');
const router = express.Router();
router.post("/",registerSIP);
router.get("/:sipId",fetchSIP);
router.post("/process/:sipId",processSIPInstallment);
router.get("/transactions/:sipId",transactionHistory);
module.exports = router;