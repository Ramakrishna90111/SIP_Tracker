import { Router } from "express";
import { getPortfolios, getInvestorPortfolio } from "../controllers/portfolioController";

const router = Router();

router.get("/", getPortfolios);
router.get("/:investorId", getInvestorPortfolio);

export default router;
