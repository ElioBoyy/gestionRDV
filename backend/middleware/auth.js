const jwt = require('jsonwebtoken');
const config = require('config');


const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        console.log(authHeader)
        const token = authHeader.split(' ')[1].split('"')[1];
        console.log(token)
        try {
            const decoded = jwt.verify(token, config.get('jwtSecret'));
            req.user = decoded.user;
            next();
        } catch (error) {
            res.status(401).json({msg:'token not valid'});
        }
    }
};
module.exports = auth;