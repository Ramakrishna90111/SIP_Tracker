import { Request, Response } from "express";
import {
    createSIP,
    getSIP,
    getAllSIPs,
    processSIP,
    getAllTransactions,
    getTransactions
} from "../models/sipModel";

export const registerSIP = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await createSIP(req.body);
        res.json(response);
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "SIP registration failed"
        });
    }
};

export const fetchSIPs = async (_req: Request, res: Response): Promise<void> => {
    try {
        const sips = await getAllSIPs();
        res.json(sips);
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "SIP list failed"
        });
    }
};

export const fetchSIP = async (req: Request, res: Response): Promise<void> => {
    try {
        const sipId = req.params.sipId as string;
        const sip = await getSIP(sipId);
        if (!sip) {
            res.status(404).json({
                error: "SIP not found"
            });
            return;
        }
        res.json(sip);
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "SIP fetch failed"
        });
    }
};

export const processSIPInstallment = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await processSIP({
            ...req.body,
            sip_id: req.body.sip_id || (req.params.sipId as string)
        });
        res.json(response);
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "SIP process failed"
        });
    }
};

export const allTransactionHistory = async (_req: Request, res: Response): Promise<void> => {
    const transactions = await getAllTransactions();
    res.json(transactions);
};

export const transactionHistory = async (req: Request, res: Response): Promise<void> => {
    const sipId = req.params.sipId as string;
    const transactions = await getTransactions(sipId);
    res.json(transactions);
};
