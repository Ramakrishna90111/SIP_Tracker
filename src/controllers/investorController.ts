import { Request, Response } from "express";
import { signJwt, JwtPayload } from "../utility/authManager";
import {
    addInvestor,
    fetchAllInvestors,
    loginUser,
    logoutUser,
    signupUser,
    fetchInvestor,
    calculateHoldings,
    calculateNetworth
} from "../models/investorModel";

const buildToken = (user: JwtPayload): string | null => signJwt({
    email: user.email,
    role: user.role,
    investor_id: user.investor_id || null
});

export const registerInvestor = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await addInvestor(req.body);
        res.status(201).json({
            message: response
        });
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "Investor registration failed"
        });
    }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body.password) {
            res.status(400).json({
                error: "Password is required"
            });
            return;
        }
        await addInvestor(req.body);
        const user = signupUser(req.body);
        if (!user) {
            res.status(409).json({
                error: "User already exists"
            });
            return;
        }
        const token = buildToken(user);
        res.status(201).json({
            token,
            investor_id: user.investor_id,
            role: user.role,
            message: "Signup successful"
        });
    } catch (error: any) {
        res.status(400).json({
            error: error.message || "Signup failed"
        });
    }
};

export const login = (req: Request, res: Response): void => {
    const { email, password } = req.body;
    const user = loginUser(email, password);
    if (!user) {
        res.status(401).json({
            error: "User not found"
        });
        return;
    }
    const token = buildToken(user);
    res.json({
        token,
        investor_id: user.investor_id,
        role: user.role
    });
};

export const logout = (req: Request, res: Response): void => {
    const { email, token } = req.body;
    const logoutStatus = logoutUser(email, token);
    if (logoutStatus) {
        res.json("Logout successful");
    } else {
        res.json("Logout failed");
    }
};

export const getInvestors = async (_req: Request, res: Response): Promise<void> => {
    const investors = await fetchAllInvestors();
    res.json(investors);
};

export const getInvestor = async (req: Request, res: Response): Promise<void> => {
    const investorId = req.params.investorId as string;
    const investor = await fetchInvestor(investorId);
    if (investor) {
        res.json(investor);
    } else {
        res.status(404).json({
            error: "Investor not found"
        });
    }
};

export const investorHoldings = async (req: Request, res: Response): Promise<void> => {
    const investorId = req.params.investorId as string;
    const holdings = await calculateHoldings(investorId);
    res.json({ holdings });
};

export const investorNetworth = async (req: Request, res: Response): Promise<void> => {
    const investorId = req.params.investorId as string;
    const networth = await calculateNetworth(investorId);
    res.json(networth);
};
