import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: 'aws-1-ap-south-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.lqebfwajycjourjveoji',
    password: process.env.password,
    maxUses: 4,
    ssl: {
        rejectUnauthorized: false
    }
});

function normalizeParams(params: unknown, callback: unknown): { params: unknown[]; callback: Function } {
    if (typeof params === 'function') {
        return { params: [], callback: params as Function };
    }
    return { params: (params as unknown[]) || [], callback: callback as Function };
}

function convertPlaceholders(sql: string): string {
    let index = 0;
    return sql.replace(/\?/g, () => `$${++index}`);
}

function handleQuery(
    sql: string,
    params: unknown[],
    callback: Function,
    mapRows: (result: QueryResult) => unknown
): void {
    pool.query(convertPlaceholders(sql), params)
        .then((result) => callback(null, mapRows(result)))
        .catch((error: Error) => callback(error));
}

export default {
    query: (sql: string, params?: unknown[]) => pool.query(sql, params),
    get: (sql: string, params: unknown | Function, callback?: Function): void => {
        const options = normalizeParams(params, callback);
        handleQuery(sql, options.params, options.callback, (result) => result.rows[0]);
    },
    all: (sql: string, params: unknown | Function, callback?: Function): void => {
        const options = normalizeParams(params, callback);
        handleQuery(sql, options.params, options.callback, (result) => result.rows);
    },
    run: (sql: string, params: unknown | Function, callback?: Function): void => {
        const options = normalizeParams(params, callback);
        handleQuery(sql, options.params, options.callback || (() => {}), () => undefined);
    },
    serialize: (callback: () => void): void => callback()
};
