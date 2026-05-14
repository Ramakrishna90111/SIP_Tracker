import jwt from 'jsonwebtoken';

const secret = "sipsecretkey123456";

export interface JwtPayload {
    email: string;
    role: string;
    investor_id: string | null;
}

export function signJwt(payload: JwtPayload): string | null {
    try {
        return jwt.sign(payload, secret, {
            expiresIn: '8h'
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function verifyJWT(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
        return null;
    }
}
