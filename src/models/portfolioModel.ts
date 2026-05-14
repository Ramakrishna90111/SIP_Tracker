import db from "../utility/pgManager";

export function fetchPortfolios(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT p.*, i.first_name, i.last_name
             FROM portfolio p
             LEFT JOIN investor i
             ON p.investor_id = i.investor_id
             ORDER BY p.created_date DESC, p.portfolio_id`,
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

export function fetchPortfolioByInvestor(investorId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT p.*, i.first_name, i.last_name
             FROM portfolio p
             LEFT JOIN investor i
             ON p.investor_id = i.investor_id
             WHERE p.investor_id = ?
             ORDER BY p.created_date DESC, p.portfolio_id`,
            [investorId],
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
