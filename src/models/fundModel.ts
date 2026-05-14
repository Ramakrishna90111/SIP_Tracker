import db from "../utility/pgManager";

export interface FundData {
    fund_id: string;
    fund_name: string;
    amc_name: string;
    fund_type: string;
    category: string;
    nav_value: number;
    nav_date: string;
    risk_level: string;
}

export function addFund(data: FundData): Promise<string> {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO mutual_fund(
                fund_id, fund_name, amc_name, fund_type, category, nav_value, nav_date, risk_level
            )
            VALUES(?,?,?,?,?,?,?,?)`,
            [
                data.fund_id,
                data.fund_name,
                data.amc_name,
                data.fund_type,
                data.category,
                data.nav_value,
                data.nav_date,
                data.risk_level
            ],
            (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("Fund Added");
                }
            }
        );
    });
}

export function fetchFunds(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM mutual_fund`,
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

export function updateNAV(fundId: string, nav: number): Promise<string> {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE mutual_fund SET nav_value = ? WHERE fund_id = ?`,
            [nav, fundId],
            (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("NAV Updated");
                }
            }
        );
    });
}
