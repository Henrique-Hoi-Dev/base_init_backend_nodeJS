const jwt = require('jsonwebtoken');

const generateToken = (payload = {}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
};

const verifyToken = (token = '') => {
    token = token.replace('Bearer ', '');
    if (!process.env.JWT_SECRET) throw Error('MISSING_API_JWT_SECRET');
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken
};
