const jwt = require('jsonwebtoken');
const config = require('config');

const SECRET = config.get('jwtSecret');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'no authorization' })
        }

        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();

    } catch (e) {
        res.status(401).json({ message: 'no authorization' })
    }
}