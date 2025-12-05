import jwt from 'jsonwebtoken';

interface JwtPayload {
    [key: string]: any;
}

const generateToken = (payload: JwtPayload = {}): string => {
    const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
    return token;
};

const verifyToken = (token: string = ''): JwtPayload => {
    const cleanToken = token.replace('Bearer ', '');
    if (!process.env.JWT_SECRET) throw Error('MISSING_API_JWT_SECRET');
    return jwt.verify(cleanToken, process.env.JWT_SECRET || '') as JwtPayload;
};

export { generateToken, verifyToken };

