import { Request, Response } from "express";
import { addFund, fetchFunds, updateNAV } from "../models/fundModel";

export const createFund = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await addFund(req.body);
        res.json(response);
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "Fund creation failed"
        });
    }
};

export const getFunds = async (_req: Request, res: Response): Promise<void> => {
    const funds = await fetchFunds();
    res.json(funds);
};

export const updateFundNAV = async (req: Request, res: Response): Promise<void> => {
    const fundId = req.params.fundId as string;
    const { nav_value } = req.body;
    try {
        const response = await updateNAV(fundId, nav_value);
        res.json(response);
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "NAV update failed"
        });
    }
};
