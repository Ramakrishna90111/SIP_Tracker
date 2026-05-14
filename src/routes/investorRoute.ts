import { Router, Request, Response, NextFunction } from "express";
import {
    registerInvestor,
    signup,
    login,
    logout,
    getInvestors,
    getInvestor,
    investorHoldings,
    investorNetworth
} from "../controllers/investorController";
import { invalidTokens } from "../models/investorModel";
import { verifyJWT } from "../utility/authManager";

const router = Router();

const authenticateInvestor = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;
    const jwtToken = token && token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    if (!jwtToken) {
        res.status(401).json("Token required");
        return;
    }

    try {
        if (invalidTokens.find((t) => t == jwtToken)) {
            res.status(401).json("Token expired");
            return;
        }
        const payload = verifyJWT(jwtToken);
        if (!payload) {
            res.status(401).json("Invalid or expired token");
            return;
        }
        if (payload && (payload.role == "investor" || payload.role == "admin")) {
            next();
            return;
        }
        res.status(403).json("Access denied");
    } catch (error) {
        res.status(401).json("Invalid token");
    }
};

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/holdings/:investorId", authenticateInvestor, investorHoldings);
router.get("/networth/:investorId", authenticateInvestor, investorNetworth);
router.post("/register", authenticateInvestor, registerInvestor);
router.get("/", authenticateInvestor, getInvestors);
router.get("/:investorId", authenticateInvestor, getInvestor);

export default router;
