import { Request, Response } from "express";
import { fetchPortfolios, fetchPortfolioByInvestor } from "../models/portfolioModel";

export const getPortfolios = async (_req: Request, res: Response): Promise<void> => {
    try {
        const portfolios = await fetchPortfolios();
        res.json(portfolios);
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "Portfolio fetch failed"
        });
    }
};

export const getInvestorPortfolio = async (req: Request, res: Response): Promise<void> => {
    try {
        const investorId = req.params.investorId as string;
        const portfolios = await fetchPortfolioByInvestor(investorId);
        res.json(portfolios);
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "Portfolio fetch failed"
        });
    }
};
