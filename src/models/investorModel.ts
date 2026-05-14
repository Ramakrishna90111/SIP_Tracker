import db from "../utility/pgManager";

interface User {
    email: string;
    password: string;
    role: string;
    investor_id: string | null;
    loggedIn: boolean;
}

interface InvestorData {
    investor_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    pan_no?: string;
    pancard_no?: string;
    address: string;
    password?: string;
}

const users: User[] = [
    {
        email: "admin@gmail.com",
        password: "12345",
        role: "admin",
        investor_id: null,
        loggedIn: false
    }
];

export const invalidTokens: string[] = [];

export function addInvestor(data: InvestorData): Promise<string> {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO investor(
                investor_id, first_name, last_name, email, phone, date_of_birth, pan_no, address
            )
            VALUES(?,?,?,?,?,?,?,?)`,
            [
                data.investor_id,
                data.first_name,
                data.last_name,
                data.email,
                data.phone,
                data.date_of_birth,
                data.pan_no || data.pancard_no,
                data.address
            ],
            (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("Investor Registered");
                }
            }
        );
    });
}

function getInvestorFromDB(investorId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM investor WHERE investor_id = ?`,
            [investorId],
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

function getAllInvestorsFromDB(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM investor ORDER BY investor_id`,
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

function getHoldingsFromDB(investorId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT mf.fund_name,
            SUM(it.units_allocated) as units_held,
            mf.nav_value,
            SUM(it.units_allocated * mf.nav_value) as current_value
        FROM investment_transaction it
        JOIN mutual_fund mf
        ON it.fund_id = mf.fund_id
        WHERE it.investor_id = ?
        AND it.transaction_status = 'Success'
        GROUP BY mf.fund_name, mf.nav_value`;
        db.all(query, [investorId], (err: Error | null, rows?: any[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

function getNetworthFromDB(investorId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
            COALESCE(SUM(it.units_allocated * mf.nav_value),0) as networth
        FROM investment_transaction it
        JOIN mutual_fund mf
        ON it.fund_id = mf.fund_id
        WHERE it.investor_id = ?
        AND it.transaction_status = 'Success'
        `;
        db.get(query, [investorId], (err: Error | null, row?: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

export const signupUser = (data: InvestorData & { password: string }): User | null => {
    const exists = users.find(
        (u) => u.email == data.email || (data.investor_id && u.investor_id == data.investor_id)
    );
    if (exists) {
        return null;
    }
    const user: User = {
        email: data.email,
        password: data.password,
        role: "investor",
        investor_id: data.investor_id,
        loggedIn: true
    };
    users.push(user);
    return user;
};

export const loginUser = (email: string, password: string): User | null => {
    const userIndex = users.findIndex(
        (u) => u.email == email && u.password == password
    );
    if (userIndex != -1) {
        users[userIndex] = {
            ...users[userIndex],
            loggedIn: true
        };
        return users[userIndex];
    }
    return null;
};

export const logoutUser = (email: string, token: string): boolean => {
    const userIndex = users.findIndex(
        (u) => u.email == email && u.loggedIn == true
    );
    if (userIndex != -1) {
        users[userIndex] = {
            ...users[userIndex],
            loggedIn: false
        };
        invalidTokens.push(token);
        return true;
    }
    return false;
};

export async function fetchInvestor(investorId: string): Promise<any | undefined> {
    try {
        const investor = await getInvestorFromDB(investorId);
        return investor;
    } catch (error) {
        return undefined;
    }
}

export async function fetchAllInvestors(): Promise<any[]> {
    try {
        const investors = await getAllInvestorsFromDB();
        return investors;
    } catch (error) {
        return [];
    }
}

export async function calculateHoldings(investorId: string): Promise<any | undefined> {
    try {
        const holdings = await getHoldingsFromDB(investorId);
        return holdings;
    } catch (error) {
        return undefined;
    }
}

export async function calculateNetworth(investorId: string): Promise<any | undefined> {
    try {
        const networth = await getNetworthFromDB(investorId);
        return networth;
    } catch (error) {
        return undefined;
    }
}
