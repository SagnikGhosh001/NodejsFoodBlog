const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.loginUser = decoded.loginUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'User is not authorized', error: error.message });
    }
});

module.exports = validToken;
