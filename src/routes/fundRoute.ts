import { Router } from "express";
import { createFund, getFunds, updateFundNAV } from "../controllers/fundController";

const router = Router();

router.post("/", createFund);
router.get("/", getFunds);
router.put("/:fundId/nav", updateFundNAV);

export default router;
