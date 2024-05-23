const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        console.log(authHeader)
        const token = authHeader.split(' ')[1].split('"')[1];
        console.log(token)
        try {
            const envSecretToken = process.env.JWTSECRET;
            const decoded = jwt.verify(token, envSecretToken);
            req.user = decoded.user;
            next();
        } catch (error) {
            res.status(401).json({msg:'token not valid'});
        }
    }
};
module.exports = auth;