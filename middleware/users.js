const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: (req, res, next) => {
        if(!req.body.username || req.body.username.length < 3) {
            return res.status(400).send({
                message: 'Please enter a username with minimun 3 characters'
            });
        }

        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                message: 'Please enter a password with minimun 6 characters'
            });
        }

        if (!req.body.password_repeat || req.body.password_repeat != req.body.password) {
            return res.status(400).send({
                message: 'Both passwords must match'
            });
        }
        next();
    },

    isLoggedIn: (req, res, next) => {
        if(!req.headers.authorization) {
            return res.status(401).send({
                message: 'Session not valid'
            });
        }
        try {
            const autHeader = req.headers.authorization;
            const token = autHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(400).send({
                message: 'Session not valid'
            });
        }
    }
}