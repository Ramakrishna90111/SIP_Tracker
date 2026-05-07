const express = require('express');
const {
    createFund,
    getFunds,
    updateFundNAV
} = require('../controllers/fundController');
const router = express.Router();
router.post("/",createFund);
router.get("/",getFunds);
router.put("/:fundId/nav",updateFundNAV);
module.exports = router;