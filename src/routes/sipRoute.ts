import { Router } from "express";
import {
    registerSIP,
    fetchSIPs,
    fetchSIP,
    processSIPInstallment,
    allTransactionHistory,
    transactionHistory
} from "../controllers/sipController";

const router = Router();

router.post("/", registerSIP);
router.get("/", fetchSIPs);
router.post("/process/:sipId", processSIPInstallment);
router.get("/transactions", allTransactionHistory);
router.get("/transactions/:sipId", transactionHistory);
router.get("/:sipId", fetchSIP);

export default router;
