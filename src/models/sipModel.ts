import db from "../utility/pgManager";

export interface SIPData {
    sip_id: string;
    investor_id: string;
    fund_id: string;
    sip_amount: number;
    sip_date: number;
    frequency: string;
    start_date: string;
    sip_status: string;
}

export interface TransactionData {
    transaction_id: string;
    sip_id: string;
    investor_id: string;
    fund_id: string;
    transaction_amount: number;
    nav_used: number;
    units_allocated: number;
    transaction_date: string;
    transaction_status: string;
}

export function createSIP(data: SIPData): Promise<string> {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO sip_registration(
                sip_id, investor_id, fund_id, sip_amount, sip_date, frequency, start_date, sip_status
            )
            VALUES(?,?,?,?,?,?,?,?)`,
            [
                data.sip_id,
                data.investor_id,
                data.fund_id,
                data.sip_amount,
                data.sip_date,
                data.frequency,
                data.start_date,
                data.sip_status
            ],
            (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("SIP Registered");
                }
            }
        );
    });
}

export function getSIP(sipId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM sip_registration WHERE sip_id = ?`,
            [sipId],
            (err: Error | null, row?: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            }
        );
    });
}

export function processSIP(data: TransactionData): Promise<string> {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO investment_transaction(
                transaction_id, sip_id, investor_id, fund_id, transaction_amount, nav_used, units_allocated, transaction_date, transaction_status
            )
            VALUES(?,?,?,?,?,?,?,?,?)`,
            [
                data.transaction_id,
                data.sip_id,
                data.investor_id,
                data.fund_id,
                data.transaction_amount,
                data.nav_used,
                data.units_allocated,
                data.transaction_date,
                data.transaction_status
            ],
            (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("SIP Processed");
                }
            }
        );
    });
}

export function getAllSIPs(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT sr.*, mf.fund_name, mf.risk_level
             FROM sip_registration sr
             LEFT JOIN mutual_fund mf
             ON sr.fund_id = mf.fund_id
             ORDER BY sr.start_date DESC, sr.sip_id`,
            [],
            (err: Error | null, rows?: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            }
        );
    });
}

export function getAllTransactions(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM investment_transaction ORDER BY transaction_date DESC, transaction_id`,
            [],
            (err: Error | null, rows?: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            }
        );
    });
}

export function getTransactions(sipId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM investment_transaction WHERE sip_id = ?`,
            [sipId],
            (err: Error | null, rows?: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            }
        );
    });
}
